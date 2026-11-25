
from pydantic import BaseModel, Field


class Prediction(BaseModel):
    breed: str
    confidence: float = Field(ge=0, le=1)


class PredictionResponse(BaseModel):
    breed: str
    confidence: float = Field(ge=0, le=1)
    predictions: list[Prediction]


class BreedsResponse(BaseModel):
    count: int
    breeds: list[str]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
