# TRUTH TRACE — AI / Synthetic Media Detection (Phase 5.4)

## What this is

`app/services/ai_detector.py` is a real, isolated ONNX Runtime inference
pipeline for AI/synthetic-image detection. It is wired into the forensic
pipeline (`app/services/pipeline.py`) and produces a structured result —
classification, confidence, model name/version, timestamp, explanation —
stored against the evidence/case in the database, shown in the AI Media
Detection page, and included in the PDF report.

**No pretrained model checkpoint ships with this repository.** Until one is
installed, the service returns an honest `INCONCLUSIVE` result
(`is_ml_based: false`) with a clear explanation — it does not fabricate a
score. The moment a compatible `.onnx` file is placed at the configured
path, real inference activates automatically; no code change is needed.

## Why no model is bundled

A credible AI-image-detection checkpoint requires either:
1. Downloading a specific, well-known, verifiable pretrained model (e.g.
   from Hugging Face Hub or a research project's release), or
2. Training one, which requires a labeled dataset and GPU time.

Neither was possible in the environment this was built in:
`huggingface.co` is not reachable (outside the allowed network egress
list), and a full PyTorch + CUDA install (~800MB+ for `torch` alone, before
a model checkpoint) did not fit the available disk budget. Rather than
substitute an unverified community model I could not vouch for the
training/accuracy of, or fake a plausible-looking score, this phase
delivers the correct, genuinely working inference architecture and
documents exactly what to install.

## What you need to install for real detection

**Any ONNX image-classification model** that:
- Accepts a single RGB image input, shape `(1, 3, 224, 224)`, NCHW,
  float32, normalized with standard ImageNet mean/std
  (`mean=[0.485,0.456,0.406]`, `std=[0.229,0.224,0.225]`).
- Outputs either:
  - a single logit (sigmoid-able) where higher = more likely AI-generated, or
  - a 2-class softmax output where the **last** class = "AI-generated".

Suitable sources once you have full internet access:
- Export a Hugging Face AI-image-detection model (several exist, e.g.
  community models trained on GenImage/CIFAKE-style datasets) to ONNX via
  `optimum` or `torch.onnx.export`.
- Any published deepfake/AI-image detector with a released ONNX export.

Place the `.onnx` file anywhere on the backend's filesystem and set:

```
AI_DETECTOR_MODEL_PATH=/path/to/model.onnx
```

(see `backend/.env.example`). Restart the backend — the model loads lazily
on first use and is cached for the process lifetime.

## Architecture notes

- **Isolated module**: all model-specific code lives in
  `app/services/ai_detector.py`. The rest of the pipeline only depends on
  `run_ai_detection(frame_path, media_kind) -> AIDetectionResult` and never
  touches ONNX/model internals directly — swapping the model, or the
  inference framework entirely, means editing this one file.
- **Video handling**: rather than a separate video-native model, this
  service runs on a single representative frame already extracted for
  perceptual fingerprinting upstream (deterministic frame sampling, see
  `app/core/video.py`) — no duplicate video decoding.
- **Graceful degradation**: missing model path, missing file, corrupt
  model, unreadable image, or an inference exception all fall through to
  the same honest `INCONCLUSIVE` result with a specific explanation of why
  — never a crash, never a silent fake score.
- **Forensic scoring safety**: the overall case forensic score
  (`compute_forensic_score` in `pipeline.py`) does NOT treat an
  `INCONCLUSIVE`/unavailable AI result as evidence of authenticity — its
  weight is redistributed across the other (deterministic) signals instead
  of silently pulling the score toward "looks fine".
- **Thresholds**: classification uses conservative bands
  (`<0.40` → Likely Authentic, `0.40–0.60` → Inconclusive, `>0.60` → Likely
  AI-Generated) with forensic wording throughout ("likely", "estimates",
  "does not rule out") — never asserted as proof.

## Tested with

A structural ONNX test fixture (a tiny `GlobalAveragePool → Flatten → Gemm`
graph matching the exact input/output contract above) was used to verify
the full inference path end-to-end: real model load via `onnxruntime`,
real image preprocessing, real inference call, real threshold logic,
correct persistence, and correct PDF/API integration. This fixture is not
a credible AI detector — it exists only to prove the plumbing works
correctly, separate from the credibility of any specific detector model
you install per the requirement above.
