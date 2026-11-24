
from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image, UnidentifiedImageError
from io import BytesIO

router = APIRouter(tags=["Predictions"])

MAX_FILE_SIZE = 5 * 1024 * 1024
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read(MAX_FILE_SIZE + 1)

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
                    detail="Only JPEG, PNG and WEBP are supported."
                )

            width, height = image.size
            image_format = image.format

            if width * height > 20_000_000:
                raise HTTPException(
                    status_code=413,
                    detail="Image dimensions are too large."
                )

            image.load()

    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image."
        )

    return {
        "message": "Image uploaded successfully",
        "filename": file.filename,
        "format": image_format,
        "width": width,
        "height": height,
        "size_bytes": len(contents)
    }
