"""Real AI/synthetic-image detection via ONNX Runtime.

This module is intentionally isolated from the rest of the forensic
pipeline so the underlying model can be swapped, upgraded, or replaced
without touching callers: everything downstream depends only on
`AIDetectionResult` and `run_ai_detection()`.

MODEL REQUIREMENT (see backend/AI_DETECTION.md for full detail):
This service expects an ONNX image-classification model at
`settings.AI_DETECTOR_MODEL_PATH` that takes a single 224x224 RGB image
tensor (NCHW, ImageNet-normalized) and outputs either a single sigmoid
"AI-generated probability" logit or a 2-class softmax [authentic, ai_gen].
No such checkpoint ships with this repository — downloading and vetting a
specific pretrained detector requires network/registry access this
environment does not have (see AI_DETECTION.md). Until a model file is
placed at that path, this service returns an honest INCONCLUSIVE result
(`is_ml_based=False`) rather than fabricating a score. The inference code
path itself is real and will activate the moment a compatible model is
present — this is not a stub UI dressed up as ML.

Video: this service operates on a single representative frame (reusing the
frame already extracted for perceptual fingerprinting upstream) rather than
implementing separate video-native inference, which is out of scope here.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

MODEL_INPUT_SIZE = 224
# Standard ImageNet normalization — matches what most public AI-image
# detector checkpoints (trained on ImageNet-pretrained backbones) expect.
_IMAGENET_MEAN = (0.485, 0.456, 0.406)
_IMAGENET_STD = (0.229, 0.224, 0.225)

MODEL_NAME_UNAVAILABLE = "none"
MODEL_VERSION_UNAVAILABLE = "n/a"


@dataclass
class AIDetectionResult:
    classification: str          # LIKELY_AI_GENERATED | LIKELY_AUTHENTIC | INCONCLUSIVE
    score: float                 # 0..100, confidence in `classification`
    severity: str                # high | medium | low (display-only, derived from score)
    model_name: str
    model_version: str
    analyzed_at: datetime
    explanation: str
    is_ml_based: bool
    label: str = field(init=False)  # short display label, backward-compatible with existing UI

    def __post_init__(self) -> None:
        self.label = {
            "LIKELY_AI_GENERATED": "Likely AI-Generated",
            "LIKELY_AUTHENTIC": "Likely Authentic",
            "INCONCLUSIVE": "Inconclusive",
        }[self.classification]


class _ModelState:
    """Lazily-loaded ONNX Runtime session, loaded at most once per process."""
    session = None
    input_name: Optional[str] = None
    load_attempted = False
    load_error: Optional[str] = None


def _try_load_model(model_path: Optional[str]) -> None:
    if _ModelState.load_attempted:
        return
    _ModelState.load_attempted = True

    if not model_path:
        _ModelState.load_error = "No AI_DETECTOR_MODEL_PATH configured"
        return
    p = Path(model_path)
    if not p.exists():
        _ModelState.load_error = f"Model file not found at {model_path}"
        return

    try:
        import onnxruntime as ort  # deferred import: keep this optional at module load time

        session = ort.InferenceSession(str(p), providers=["CPUExecutionProvider"])
        _ModelState.session = session
        _ModelState.input_name = session.get_inputs()[0].name
    except Exception as exc:  # noqa: BLE001 - genuinely any load failure should degrade gracefully
        _ModelState.load_error = f"Failed to load ONNX model: {exc}"
        _ModelState.session = None


def _preprocess_image(image_path: Path):
    """Load, resize, and normalize an image into the NCHW float32 tensor
    the model expects. Raises on unreadable/corrupt images — caller
    catches and reports INCONCLUSIVE."""
    import numpy as np
    from PIL import Image

    with Image.open(image_path) as im:
        im = im.convert("RGB").resize((MODEL_INPUT_SIZE, MODEL_INPUT_SIZE))
        arr = np.asarray(im, dtype=np.float32) / 255.0

    mean = np.array(_IMAGENET_MEAN, dtype=np.float32)
    std = np.array(_IMAGENET_STD, dtype=np.float32)
    arr = (arr - mean) / std
    arr = arr.transpose(2, 0, 1)  # HWC -> CHW
    return arr[None, ...]  # add batch dim -> NCHW


def _run_inference(frame_path: Path) -> tuple[float, str] | None:
    """Returns (ai_generated_probability, explanation) or None if inference
    could not run (model absent, load failure, unreadable image)."""
    from app.core.config import settings

    _try_load_model(settings.AI_DETECTOR_MODEL_PATH)
    if _ModelState.session is None:
        return None

    try:
        tensor = _preprocess_image(frame_path)
        outputs = _ModelState.session.run(None, {_ModelState.input_name: tensor})
        raw = outputs[0]
        # Support both a single-sigmoid-logit output and a 2-class softmax
        # output — both are common shapes for public AI-detector checkpoints.
        flat = raw.flatten()
        if flat.size == 1:
            import math
            prob_ai = 1.0 / (1.0 + math.exp(-float(flat[0])))  # sigmoid
        elif flat.size >= 2:
            import numpy as np
            exps = np.exp(flat - flat.max())
            probs = exps / exps.sum()
            prob_ai = float(probs[-1])  # convention: last class = "AI-generated"
        else:
            return None
        return prob_ai, "ONNX model inference on a representative frame"
    except Exception as exc:  # noqa: BLE001
        logger.warning("AI detector inference failed: %s", exc)
        return None


def run_ai_detection(frame_path: Optional[Path], media_kind: str) -> AIDetectionResult:
    """Entry point used by the forensic pipeline. `frame_path` should be a
    real image file — for video evidence, the caller passes a representative
    extracted frame (reusing the same frame extraction used for perceptual
    fingerprinting), not the raw video container.
    """
    now = datetime.utcnow()

    if media_kind not in ("image", "video") or frame_path is None or not Path(frame_path).exists():
        return AIDetectionResult(
            classification="INCONCLUSIVE", score=0.0, severity="low",
            model_name=MODEL_NAME_UNAVAILABLE, model_version=MODEL_VERSION_UNAVAILABLE,
            analyzed_at=now, is_ml_based=False,
            explanation="Unsupported or unavailable media for AI-detection inference.",
        )

    result = _run_inference(Path(frame_path))
    if result is None:
        reason = _ModelState.load_error or "AI-detection model unavailable"
        return AIDetectionResult(
            classification="INCONCLUSIVE", score=0.0, severity="low",
            model_name=MODEL_NAME_UNAVAILABLE, model_version=MODEL_VERSION_UNAVAILABLE,
            analyzed_at=now, is_ml_based=False,
            explanation=(
                f"No AI-detection model result available ({reason}). "
                "This is not evidence of authenticity or manipulation — "
                "it means the ML classifier could not be run."
            ),
        )

    prob_ai, method_note = result
    confidence_pct = round(max(prob_ai, 1 - prob_ai) * 100, 1)

    # Deliberately conservative thresholds and forensic wording — never
    # "proof", always "likely" / "inconclusive" for borderline scores.
    if 0.40 <= prob_ai <= 0.60:
        classification = "INCONCLUSIVE"
        severity = "medium"
        explanation = (
            f"Model output ({prob_ai * 100:.1f}% AI-generated likelihood) falls in the "
            "borderline range and does not support a confident classification either way."
        )
    elif prob_ai > 0.60:
        classification = "LIKELY_AI_GENERATED"
        severity = "high" if prob_ai >= 0.85 else "medium"
        explanation = (
            f"Model estimates a {prob_ai * 100:.1f}% likelihood this media is AI-generated "
            f"or synthetically altered, based on {method_note}. This is a probabilistic "
            "indicator, not definitive proof."
        )
    else:
        classification = "LIKELY_AUTHENTIC"
        severity = "low"
        explanation = (
            f"Model estimates a {(1 - prob_ai) * 100:.1f}% likelihood this media is authentic "
            f"(unmanipulated by AI generation), based on {method_note}. This does not rule out "
            "other forms of manipulation (e.g. traditional editing, splicing)."
        )

    from app.core.config import settings

    return AIDetectionResult(
        classification=classification, score=confidence_pct, severity=severity,
        model_name=Path(settings.AI_DETECTOR_MODEL_PATH).stem if settings.AI_DETECTOR_MODEL_PATH else MODEL_NAME_UNAVAILABLE,
        model_version="onnx-runtime-inference", analyzed_at=now,
        explanation=explanation, is_ml_based=True,
    )
