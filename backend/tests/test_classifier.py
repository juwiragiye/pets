
from unittest.mock import Mock
from threading import Lock

import pytest
import torch
from PIL import Image

from app.services.classifier import PetClassifier


@pytest.fixture
def classifier():

    classifier = PetClassifier.__new__(
        PetClassifier
    )

    classifier.breeds = [
        "beagle",
        "basset_hound",
        "shiba_inu"
    ]

    classifier.lock = Lock()

    classifier.learner = Mock()

    classifier.learner.predict.return_value = (
        "beagle",
        0,
        torch.tensor([0.96, 0.03, 0.01])
    )

    return classifier


def test_format_breed():
    assert PetClassifier.format_breed(
        "basset_hound"
    ) == "Basset Hound"


def test_get_breeds(classifier):
    assert classifier.get_breeds() == [
        "Beagle",
        "Basset Hound",
        "Shiba Inu"
    ]


def test_predict_returns_dictionary(classifier):
    image = Image.new("RGB", (224, 224))

    result = classifier.predict(image)

    assert isinstance(result, dict)


def test_predict_top_breed(classifier):
    image = Image.new("RGB", (224, 224))

    result = classifier.predict(image)

    assert result["breed"] == "Beagle"

    assert result["confidence"] == pytest.approx(
        0.96
    )


def test_predict_top_three(classifier):
    image = Image.new("RGB", (224, 224))

    result = classifier.predict(image)

    assert len(result["predictions"]) == 3


def test_predictions_sorted(classifier):
    image = Image.new("RGB", (224, 224))

    result = classifier.predict(image)

    scores = [
        prediction["confidence"]
        for prediction in result["predictions"]
    ]

    assert scores == sorted(
        scores,
        reverse=True
    )
