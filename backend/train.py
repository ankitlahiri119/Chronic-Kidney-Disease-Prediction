"""

This version follows the revised notebook pipeline:
- Clean column names and text values
- Convert known numeric columns to numeric values
- Clean the CKD target
- Split data before fitting preprocessing
- Impute missing values and encode categorical values inside a pipeline
- Evaluate with stratified 5-fold cross-validation and a held-out test set
- Train XGBoost without SMOTE/data augmentation
- Save a model package compatible with loaders expecting a "pipeline" key
"""

from pathlib import Path
import warnings

import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
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
    confusion_matrix,
)
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier


# ==================================================
# PATHS
# ==================================================

# Assumes this file is located at project/backend/train.py.
ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "data" / "kidney_disease.csv"
MODEL_DIR = ROOT / "backend" / "models"
MODEL_PATH = MODEL_DIR / "ckd_model.pkl"

MODEL_DIR.mkdir(parents=True, exist_ok=True)


# ==================================================
# LOAD DATA
# ==================================================

print("\nLoading dataset...")
if not DATA_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found at: {DATA_PATH}\n"
        "Check that kidney_disease.csv is inside the project's data folder."
    )

df = pd.read_csv(DATA_PATH)
print("Original shape:", df.shape)


# ==================================================
# CLEAN COLUMN NAMES
# ==================================================

df.columns = df.columns.astype(str).str.strip().str.lower()


# ==================================================
# CLEAN TEXT VALUES AND MISSING-VALUE MARKERS
# ==================================================

for column in df.select_dtypes(include=["object", "string"]).columns:
    df[column] = (
        df[column]
        .astype("string")
        .str.strip()
        .str.lower()
    )

df = df.replace(
    {
        "?": np.nan,
        "": np.nan,
        "nan": np.nan,
        "none": np.nan,
        "null": np.nan,
    }
)

if "classification" not in df.columns:
    raise KeyError(
        "Required target column 'classification' was not found. "
        f"Available columns: {df.columns.tolist()}"
    )


# ==================================================
# CONVERT NUMERIC FEATURES
# ==================================================

numeric_columns = [
    "age", "bp", "sg", "al", "su", "bgr", "bu", "sc",
    "sod", "pot", "hemo", "pcv", "wc", "rc",
]

for column in numeric_columns:
    if column in df.columns:
        df[column] = pd.to_numeric(df[column], errors="coerce")


# ==================================================
# CLEAN TARGET LABELS
# ==================================================

target = (
    df["classification"]
    .astype("string")
    .str.strip()
    .str.lower()
    .str.replace(r"\s+", "", regex=True)
    .str.replace(r"[.]$", "", regex=True)
)

target_mapping = {
    "ckd": 1,
    "notckd": 0,
}

df["classification"] = target.map(target_mapping)

# Remove rows where the target is missing or is not one of the known labels.
before_target_cleaning = len(df)
df = df.dropna(subset=["classification"]).copy()
df["classification"] = df["classification"].astype(int)

if len(df) == 0:
    raise ValueError(
        "No valid target rows remain. Expected classification values such as "
        "'ckd' and 'notckd' (optionally with a trailing period)."
    )

if df["classification"].nunique() != 2:
    raise ValueError(
        "The cleaned target must contain both classes (CKD and Not CKD). "
        f"Found: {df['classification'].value_counts().to_dict()}"
    )

print(
    f"Rows removed for missing/invalid target: "
    f"{before_target_cleaning - len(df)}"
)


# ==================================================
# REMOVE ID COLUMN
# ==================================================

if "id" in df.columns:
    df = df.drop(columns=["id"])


# ==================================================
# CHECK CLEANED DATA
# ==================================================

print("\nCleaned shape:", df.shape)
print("\nTarget distribution:")
print(df["classification"].value_counts().sort_index())
print("\nTarget missing values:", df["classification"].isna().sum())


# ==================================================
# FEATURES AND TARGET
# ==================================================

X = df.drop(columns=["classification"]).copy()
y = df["classification"].copy()

# Pandas nullable string columns may contain pd.NA, which can break
# SimpleImputer in some scikit-learn versions. Convert non-numeric feature
# columns to ordinary Python objects and normalize all missing entries to np.nan.
# Numeric columns retain their numeric dtype.
for column in X.columns:
    if not pd.api.types.is_numeric_dtype(X[column].dtype):
        X[column] = X[column].astype(object)
        X[column] = X[column].where(pd.notna(X[column]), np.nan)

if X.shape[1] == 0:
    raise ValueError("No feature columns remain after removing the target and ID.")

# Remove entirely empty columns because they contain no learnable information
# and cannot be imputed reliably by SimpleImputer across all sklearn versions.
empty_columns = X.columns[X.isna().all()].tolist()
if empty_columns:
    print("\nDropping completely empty feature columns:", empty_columns)
    X = X.drop(columns=empty_columns)

if X.shape[1] == 0:
    raise ValueError("All feature columns are empty after cleaning.")


# ==================================================
# TRAIN / TEST SPLIT
# ==================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)

print("\nTraining data:", X_train.shape)
print("Testing data:", X_test.shape)


# ==================================================
# FEATURE TYPES
# ==================================================

# Select types from the training split only. Boolean and pandas string/category
# columns are treated as categorical.
numeric_features = X_train.select_dtypes(include=["number"]).columns.tolist()
categorical_features = X_train.select_dtypes(
    include=["object", "string", "category", "bool"]
).columns.tolist()

# If any uncommon dtype remains, treat it as categorical rather than silently
# dropping it from the model.
unassigned_features = [
    col for col in X_train.columns
    if col not in numeric_features and col not in categorical_features
]
if unassigned_features:
    categorical_features.extend(unassigned_features)

print("\nNumerical features:")
print(numeric_features)
print("\nCategorical features:")
print(categorical_features)


# ==================================================
# PREPROCESSING
# ==================================================

numeric_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="median", add_indicator=True),
        )
    ]
)

categorical_transformer = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(strategy="most_frequent"),
        ),
        (
            "encoder",
            OrdinalEncoder(
                handle_unknown="use_encoded_value",
                unknown_value=-1,
            ),
        ),
    ]
)

transformers = []
if numeric_features:
    transformers.append(("numeric", numeric_transformer, numeric_features))
if categorical_features:
    transformers.append(
        ("categorical", categorical_transformer, categorical_features)
    )

preprocessor = ColumnTransformer(
    transformers=transformers,
    remainder="drop",
)


# ==================================================
# CLASS IMBALANCE INFORMATION
# ==================================================

print("\nTraining class distribution:")
print(y_train.value_counts().sort_index())
print("\nTraining class proportions:")
print(y_train.value_counts(normalize=True).sort_index())

print(
    "\nSMOTE/SMOTENC and data augmentation are not used in this pipeline. "
    "The model trains on the original training records."
)


# ==================================================
# XGBOOST MODEL
# ==================================================

model = XGBClassifier(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.03,
    min_child_weight=3,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_alpha=0.1,
    reg_lambda=2.0,
    objective="binary:logistic",
    eval_metric="logloss",
    random_state=42,
    n_jobs=-1,
)


# ==================================================
# COMPLETE PIPELINE
# ==================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("xgboost", model),
    ]
)


# ==================================================
# STRATIFIED 5-FOLD CROSS-VALIDATION
# ==================================================

class_counts = y_train.value_counts()
n_splits = min(5, int(class_counts.min()))

if n_splits < 2:
    warnings.warn(
        "At least one class has fewer than two training examples; "
        "cross-validation is skipped."
    )
    cv_scores = np.array([])
else:
    cv = StratifiedKFold(
        n_splits=n_splits,
        shuffle=True,
        random_state=42,
    )
    print(f"\nEvaluating with {n_splits}-fold stratified cross-validation...")
    cv_scores = cross_val_score(
        pipeline,
        X_train,
        y_train,
        cv=cv,
        scoring="accuracy",
        n_jobs=1,
    )
    print("Cross-validation accuracy scores:", np.round(cv_scores, 4))
    print(f"Mean CV accuracy: {cv_scores.mean():.4f} ({cv_scores.mean() * 100:.2f}%)")
    print(f"CV standard deviation: {cv_scores.std():.4f}")


# ==================================================
# TRAIN FINAL MODEL
# ==================================================

print("\nTraining XGBoost pipeline on the training split...")
pipeline.fit(X_train, y_train)
print("Training completed.")


# ==================================================
# PREDICTIONS
# ==================================================

y_pred = pipeline.predict(X_test)
y_probability = pipeline.predict_proba(X_test)[:, 1]


# ==================================================
# EVALUATION METRICS
# ==================================================

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, zero_division=0)
recall = recall_score(y_test, y_pred, zero_division=0)
f1 = f1_score(y_test, y_pred, zero_division=0)

# ROC-AUC requires both classes to be present in the held-out test labels.
roc_auc = (
    roc_auc_score(y_test, y_probability)
    if y_test.nunique() == 2
    else float("nan")
)


# ==================================================
# RESULTS
# ==================================================

print("\n================================")
print("FINAL XGBOOST RESULTS")
print("================================")
print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"ROC-AUC  : {roc_auc:.4f}")


# ==================================================
# CLASSIFICATION REPORT
# ==================================================

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        labels=[0, 1],
        target_names=["Not CKD", "CKD"],
        zero_division=0,
    )
)


# ==================================================
# CONFUSION MATRIX
# ==================================================

print("\nConfusion Matrix (rows=true, columns=predicted; labels=[0, 1]):")
print(confusion_matrix(y_test, y_pred, labels=[0, 1]))


# ==================================================
# SAVE MODEL PACKAGE
# ==================================================

model_package = {
    "pipeline": pipeline,
    "features": X.columns.tolist(),
    "numeric_features": numeric_features,
    "categorical_features": categorical_features,
    "model_name": "XGBoost",
    "target_mapping": {"notckd": 0, "ckd": 1},
    "metrics": {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
        "roc_auc": float(roc_auc),
        "cv_accuracy_mean": (
            float(cv_scores.mean()) if len(cv_scores) else None
        ),
        "cv_accuracy_std": (
            float(cv_scores.std()) if len(cv_scores) else None
        ),
    },
}

joblib.dump(model_package, MODEL_PATH)

print("\nModel saved successfully:")
print(MODEL_PATH)
print("Saved package keys:", list(model_package.keys()))
