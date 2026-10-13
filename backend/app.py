from pathlib import Path
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocessing import clean_dataframe

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "ckd_model.pkl"

model_package = joblib.load(MODEL_PATH)

pipeline = model_package["pipeline"]
FEATURES = model_package["features"]
MODEL_NAME = model_package["model_name"]
METRICS = model_package.get("metrics", {})


@app.route("/")
def home():
    return jsonify({
        "message": "Chronic Kidney Disease Prediction API",
        "status": "running",
        "model": MODEL_NAME
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "OK"
    })


@app.route("/api/metrics")
def metrics():
    return jsonify({
        "model": MODEL_NAME,
        "metrics": METRICS
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No JSON data received"
            }), 400

        input_df = pd.DataFrame([data])
        input_df = clean_dataframe(input_df)

        missing_features = [
            feature
            for feature in FEATURES
            if feature not in input_df.columns
        ]

        if missing_features:
            return jsonify({
                "error": "Missing required features",
                "missing_features": missing_features
            }), 400

        input_df = input_df[FEATURES]

        prediction = pipeline.predict(input_df)[0]
        probabilities = pipeline.predict_proba(input_df)[0]

        not_ckd_probability = float(probabilities[0]) * 100
        ckd_probability = float(probabilities[1]) * 100

        result = "CKD" if int(prediction) == 1 else "Not CKD"

        return jsonify({
            "prediction": int(prediction),
            "result": result,
            "ckd_probability": round(ckd_probability, 2),
            "not_ckd_probability": round(not_ckd_probability, 2),
            "model": MODEL_NAME,
            "disclaimer": (
                "This system is for educational and research purposes "
                "only and is not a medical diagnosis."
            )
        })

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )