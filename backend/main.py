from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from predictor import predict_sentiment

app = FastAPI(title="DarijaInsight API")

# --- AJOUT CONFIGURATION CORS ---
# Vous pouvez lister précisément les URLs de votre frontend à la place de ["*"]
# Exemple : ["http://localhost:3000", "http://127.0.0.1:5500"]
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Autorise OPTIONS, POST, GET, etc.
    allow_headers=["*"],  # Autorise tous les headers (Content-Type, etc.)
)
# --------------------------------


class Review(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "DarijaInsight API running"}


@app.post("/predict")
def predict(review: Review):
    return predict_sentiment(review.text)