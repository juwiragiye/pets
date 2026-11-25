
from io import BytesIO

import pytest
from PIL import Image
from fastapi.testclient import TestClient

from app.main import app
from app.routes.predictions import get_classifier


class MockClassifier:

    def get_breeds(self):
        return [
            "Beagle",
            "Basset Hound",
            "Shiba Inu"
        ]

    def predict(self, image):
        return {
            "breed": "Beagle",
            "confidence": 0.96,
            "predictions": [
                {
                    "breed": "Beagle",
                    "confidence": 0.96
                },
                {
                    "breed": "Basset Hound",
                    "confidence": 0.03
                },
                {
                    "breed": "Shiba Inu",
                    "confidence": 0.01
                }
            ]
        }


@pytest.fixture
def client(monkeypatch, tmp_path):

    monkeypatch.setattr(
        "app.main.MODEL_PATH",
        tmp_path / "missing-model.pkl"
    )

    app.dependency_overrides[get_classifier] = (
        lambda: MockClassifier()
    )

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()


@pytest.fixture
def sample_image():
    image = Image.new(
        "RGB",
        (224, 224),
        color="white"
    )

    buffer = BytesIO()
    image.save(buffer, format="JPEG")

    return buffer.getvalue()
