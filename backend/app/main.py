
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import MODEL_PATH
from app.routes import predictions
from app.schemas import HealthResponse
from app.services.classifier import PetClassifier


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.classifier = None

    if MODEL_PATH.is_file():
        app.state.classifier = PetClassifier(MODEL_PATH)
        logger.info("Pet classification model loaded.")
    else:
        logger.warning("Model file not found: %s", MODEL_PATH)

    yield

    app.state.classifier = None


app = FastAPI(
    title="Pets API",
    description="A deep learning API for pet breed classification.",
    version="0.1.0",
    lifespan=lifespan
)

app.include_router(predictions.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Pets API"
    }


@app.get("/health", response_model=HealthResponse)
def health():
    return {
        "status": "ok",
        "model_loaded": app.state.classifier is not None
    }
