from transformers import pipeline, AutoTokenizer

# ==========================
# Modèle final entraîné
# ==========================
MODEL_PATH = "../training/darijainsight_model/checkpoint-1818"

print("[INFO] Chargement du modèle final...")

# Chargement du tokenizer sauvegardé avec le modèle
tokenizer = AutoTokenizer.from_pretrained("UBC-NLP/MARBERT")

# Chargement du pipeline
classifier = pipeline(
    task="text-classification",
    model=MODEL_PATH,
    tokenizer=tokenizer,
    framework="pt"
)

print("[INFO] Modèle chargé avec succès.")

LABELS = {
    "LABEL_0": "Neutral",
    "LABEL_1": "Negative",
    "LABEL_2": "Positive"
}

def predict_sentiment(text):

    prediction = classifier(text)[0]

    print("Prédiction brute :", prediction)

    return {
        "sentiment": LABELS.get(prediction["label"], prediction["label"]),
        "score": round(float(prediction["score"]), 4)
    }


if __name__ == "__main__":

    tests = [
        "الخدمة زوينة بزاف",
        "الخدمة خايبة بزاف",
        "الثمن عادي",
        "أنا فرحان بزاف",
        "أنا زعفان بزاف"
    ]

    for text in tests:
        print("=" * 60)
        print(text)
        print(predict_sentiment(text))