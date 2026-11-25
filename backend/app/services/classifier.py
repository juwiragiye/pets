
from pathlib import Path
from threading import Lock

from fastai.vision.all import PILImage, load_learner
from PIL import Image

from app.config import TOP_K


class PetClassifier:

    def __init__(self, model_path: Path):
        self.learner = load_learner(
            model_path,
            cpu=True
        )

        self.breeds = list(self.learner.dls.vocab)
        self.lock = Lock()

    @staticmethod
    def format_breed(breed: str) -> str:
        return breed.replace("_", " ").title()

    def get_breeds(self):
        return [
            self.format_breed(breed)
            for breed in self.breeds
        ]

    def predict(self, image: Image.Image):
        image = PILImage.create(image.convert("RGB"))

        with self.lock:
            _, _, probabilities = self.learner.predict(image)

        scores, indices = probabilities.topk(
            min(TOP_K, len(self.breeds))
        )

        predictions = []

        for score, index in zip(scores, indices):
            predictions.append({
                "breed": self.format_breed(
                    self.breeds[int(index)]
                ),
                "confidence": float(score)
            })

        return {
            "breed": predictions[0]["breed"],
            "confidence": predictions[0]["confidence"],
            "predictions": predictions
        }
