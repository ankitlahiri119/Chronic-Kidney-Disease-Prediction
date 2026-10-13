import pandas as pd
import numpy as np


NUMERIC_COLUMNS = [
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


def clean_dataframe(df):

    df = df.copy()

    # Clean column names
    df.columns = df.columns.str.strip()

    # Clean text values
    for column in df.select_dtypes(include="object").columns:

        df[column] = (
            df[column]
            .astype(str)
            .str.strip()
            .str.lower()
        )

    # Convert common missing values
    df = df.replace(
        ["?", "nan", "none", ""],
        np.nan
    )

    # Convert numerical columns
    for column in NUMERIC_COLUMNS:

        if column in df.columns:

            df[column] = pd.to_numeric(
                df[column],
                errors="coerce"
            )

    return df