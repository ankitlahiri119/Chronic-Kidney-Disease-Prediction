from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OrdinalEncoder

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)

from imblearn.over_sampling import SMOTENC
from imblearn.pipeline import Pipeline

from xgboost import XGBClassifier


# ==================================================
# PATHS
# ==================================================

ROOT = Path(__file__).resolve().parent.parent

DATA_PATH = (
    ROOT /
    "data" /
    "kidney_disease.csv"
)

MODEL_DIR = (
    ROOT /
    "backend" /
    "models"
)

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

MODEL_PATH = (
    MODEL_DIR /
    "ckd_model.pkl"
)


# ==================================================
# LOAD DATA
# ==================================================

print("\nLoading dataset...")

df = pd.read_csv(DATA_PATH)

print(
    "Original shape:",
    df.shape
)


# ==================================================
# CLEAN COLUMN NAMES
# ==================================================

df.columns = (
    df.columns
    .str.strip()
)


# ==================================================
# CLEAN TEXT COLUMNS
# ==================================================

for column in df.select_dtypes(
    include="object"
).columns:

    df[column] = (
        df[column]
        .astype(str)
        .str.strip()
        .str.lower()
    )


# ==================================================
# MISSING VALUES
# ==================================================

df = df.replace(
    ["?", "nan", "none", ""],
    np.nan
)


# ==================================================
# NUMERIC COLUMNS
# ==================================================

numeric_columns = [
    "age",
    "bp",
    "sg",
    "al",
    "su",
    "bgr",
    "bu",
    "sc",
    "sod",
    "pot",
    "hemo",
    "pcv",
    "wc",
    "rc"
]


for column in numeric_columns:

    if column in df.columns:

        df[column] = pd.to_numeric(
            df[column],
            errors="coerce"
        )


# ==================================================
# TARGET CLEANING
# ==================================================

df["classification"] = (
    df["classification"]
    .astype("string")
    .str.strip()
    .str.lower()
    .str.replace(
        r"\s+",
        "",
        regex=True
    )
)


df["classification"] = (
    df["classification"].replace({
        "ckd": 1,
        "notckd": 0
    })
)


# ==================================================
# REMOVE INVALID TARGET ROWS
# ==================================================

df = df.dropna(
    subset=["classification"]
)


df["classification"] = (
    df["classification"].astype(int)
)


# ==================================================
# REMOVE ID
# ==================================================

if "id" in df.columns:

    df = df.drop(
        columns=["id"]
    )


# ==================================================
# CHECK TARGET
# ==================================================

print(
    "\nCleaned shape:",
    df.shape
)

print(
    "\nTarget distribution:"
)

print(
    df["classification"].value_counts()
)

print(
    "\nTarget NaN:",
    df["classification"].isna().sum()
)


# ==================================================
# X AND Y
# ==================================================

X = df.drop(
    columns=["classification"]
)

y = df["classification"]


# ==================================================
# TRAIN TEST SPLIT
# ==================================================

X_train, X_test, y_train, y_test = (
    train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )
)


print(
    "\nTraining data:",
    X_train.shape
)

print(
    "Testing data:",
    X_test.shape
)


# ==================================================
# FEATURE TYPES
# ==================================================

numeric_features = (
    X_train
    .select_dtypes(
        include=["int64", "float64"]
    )
    .columns
    .tolist()
)


categorical_features = (
    X_train
    .select_dtypes(
        include=[
            "object",
            "string",
            "category"
        ]
    )
    .columns
    .tolist()
)


print(
    "\nNumeric features:"
)

print(
    numeric_features
)


print(
    "\nCategorical features:"
)

print(
    categorical_features
)


# ==================================================
# NUMERIC PREPROCESSING
# ==================================================

numeric_transformer = Pipeline(
    steps=[

        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        )
    ]
)


# ==================================================
# CATEGORICAL PREPROCESSING
# ==================================================

categorical_transformer = Pipeline(
    steps=[

        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),

        (
            "encoder",
            OrdinalEncoder(
                handle_unknown="use_encoded_value",
                unknown_value=-1
            )
        )
    ]
)


# ==================================================
# COMBINED PREPROCESSOR
# ==================================================

preprocessor = ColumnTransformer(
    transformers=[

        (
            "numeric",
            numeric_transformer,
            numeric_features
        ),

        (
            "categorical",
            categorical_transformer,
            categorical_features
        )
    ]
)


# ==================================================
# SMOTENC CATEGORICAL INDICES
# ==================================================

categorical_indices = list(
    range(
        len(numeric_features),
        len(numeric_features)
        + len(categorical_features)
    )
)


print(
    "\nSMOTENC categorical indices:"
)

print(
    categorical_indices
)


# ==================================================
# SMOTENC
# ==================================================

smote = SMOTENC(
    categorical_features=categorical_indices,
    random_state=42
)


# ==================================================
# XGBOOST
# ==================================================

model = XGBClassifier(

    n_estimators=300,

    max_depth=4,

    learning_rate=0.05,

    subsample=0.8,

    colsample_bytree=0.8,

    objective="binary:logistic",

    eval_metric="logloss",

    random_state=42,

    n_jobs=-1
)


# ==================================================
# COMPLETE PIPELINE
# ==================================================

pipeline = Pipeline(
    steps=[

        (
            "preprocessor",
            preprocessor
        ),

        (
            "smotenc",
            smote
        ),

        (
            "xgboost",
            model
        )
    ]
)


# ==================================================
# TRAIN
# ==================================================

print(
    "\nTraining XGBoost with SMOTENC..."
)

pipeline.fit(
    X_train,
    y_train
)


print(
    "Training completed."
)


# ==================================================
# PREDICTION
# ==================================================

y_pred = pipeline.predict(
    X_test
)


y_probability = (
    pipeline.predict_proba(
        X_test
    )[:, 1]
)


# ==================================================
# METRICS
# ==================================================

accuracy = accuracy_score(
    y_test,
    y_pred
)


precision = precision_score(
    y_test,
    y_pred,
    zero_division=0
)


recall = recall_score(
    y_test,
    y_pred,
    zero_division=0
)


f1 = f1_score(
    y_test,
    y_pred,
    zero_division=0
)


roc_auc = roc_auc_score(
    y_test,
    y_probability
)


# ==================================================
# RESULTS
# ==================================================

print(
    "\n================================"
)

print(
    "FINAL XGBOOST RESULTS"
)

print(
    "================================"
)

print(
    f"Accuracy : {accuracy:.4f}"
)

print(
    f"Precision: {precision:.4f}"
)

print(
    f"Recall   : {recall:.4f}"
)

print(
    f"F1 Score : {f1:.4f}"
)

print(
    f"ROC-AUC  : {roc_auc:.4f}"
)


# ==================================================
# CLASSIFICATION REPORT
# ==================================================

print(
    "\nClassification Report:"
)

print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Not CKD",
            "CKD"
        ],
        zero_division=0
    )
)


# ==================================================
# CONFUSION MATRIX
# ==================================================

print(
    "\nConfusion Matrix:"
)

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


# ==================================================
# SAVE MODEL PACKAGE
# ==================================================

model_package = {

    "pipeline":
        pipeline,

    "features":
        X.columns.tolist(),

    "numeric_features":
        numeric_features,

    "categorical_features":
        categorical_features,

    "model_name":
        "XGBoost",

    "metrics": {

        "accuracy":
            float(accuracy),

        "precision":
            float(precision),

        "recall":
            float(recall),

        "f1":
            float(f1),

        "roc_auc":
            float(roc_auc)
    }
}


joblib.dump(
    model_package,
    MODEL_PATH
)


print(
    "\nModel saved:"
)

print(
    MODEL_PATH
)