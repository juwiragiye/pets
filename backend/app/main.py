from fastapi import FastAPI
from app.routes import predictions

app = FastAPI(
    title="Pets API",
    description="A deep learning api for classifying pet breeds",
    version="0.1.0"
)
app.include_router(predictions.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to the Pets API"
    }
    
@app.get("/health")
def health():
    return {
        "status": "ok"
    }