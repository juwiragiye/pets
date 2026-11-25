
from io import BytesIO

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    Request
)
from PIL import Image, ImageOps, UnidentifiedImageError

from app.config import (
    MAX_FILE_SIZE,
    MAX_IMAGE_PIXELS,
    ALLOWED_FORMATS
)
from app.schemas import PredictionResponse, BreedsResponse
from app.services.classifier import PetClassifier


router = APIRouter(tags=["Predictions"])


def get_classifier(request: Request) -> PetClassifier:
    classifier = request.app.state.classifier

    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not available."
        )

    return classifier


@router.get("/breeds", response_model=BreedsResponse)
def get_breeds(
    classifier: PetClassifier = Depends(get_classifier)
):
    breeds = classifier.get_breeds()

    return {
        "count": len(breeds),
        "breeds": breeds
    }


@router.post("/predict", response_model=PredictionResponse)
def predict(
    file: UploadFile = File(...),
    classifier: PetClassifier = Depends(get_classifier)
):
    contents = file.file.read(MAX_FILE_SIZE + 1)

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must not exceed 5 MB."
        )

    try:
        with Image.open(BytesIO(contents)) as image:

            if image.format not in ALLOWED_FORMATS:
                raise HTTPException(
                    status_code=415,
                    detail="Unsupported image format."
                )

            width, height = image.size

            if width * height > MAX_IMAGE_PIXELS:
                raise HTTPException(
                    status_code=413,
                    detail="Image dimensions are too large."
                )

            image.load()

            prepared_image = ImageOps.exif_transpose(
                image
            ).convert("RGB")

    except (
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image."
        )

    return classifier.predict(prepared_image)
