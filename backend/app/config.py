
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = BASE_DIR / "model" / "exports" / "pets.pkl"

MAX_FILE_SIZE = 5 * 1024 * 1024

MAX_IMAGE_PIXELS = 20_000_000

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

TOP_K = 3
