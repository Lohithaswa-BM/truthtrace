from pathlib import Path
from typing import Optional

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parents[2]  # backend/


class Settings(BaseSettings):
    APP_NAME: str = "TRUTH TRACE"
    APP_VERSION: str = "1.0"
    ORG_NAME: str = "Chandigarh Police"
    ORG_UNIT: str = "Digital Forensics Unit"

    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'truthtrace.db'}"
    STORAGE_DIR: Path = BASE_DIR / "app" / "storage"

    # CORS: defaults cover local dev (Vite). For a deployed frontend, set
    # CORS_ORIGINS as a JSON array env var, e.g.
    # CORS_ORIGINS=["https://truthtrace.vercel.app"]
    # pydantic-settings parses list[str] fields from such an env var
    # automatically — no code change needed to override this in production.
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Similarity: max Hamming distance (out of 64 bits) counted as a "match"
    PHASH_MATCH_THRESHOLD: int = 12

    # Phase 5.4: path to an ONNX AI/synthetic-image-detection model. If
    # unset or the file is missing, the AI detection service degrades
    # honestly to INCONCLUSIVE (is_ml_based=False) rather than fabricating
    # a score. See backend/AI_DETECTION.md for the exact model requirement.
    AI_DETECTOR_MODEL_PATH: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
