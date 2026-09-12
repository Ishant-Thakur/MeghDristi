"""
Shared model definitions — used by BOTH 04_train_model.py (training) and
inference/risk_model.py (serving).

WHY THIS FILE EXISTS: EnsembleModel is a custom class, and joblib/pickle
needs to import a class from its ORIGINAL module by name when loading a
saved model back. 04_train_model.py can't be imported normally (Python
module names can't start with a digit — it only works via the importlib
trick used elsewhere in this project), so a model saved from inside that
script cannot be loaded back from a different file that doesn't do the
same importlib trick. Defining these here, in a normally-importable
module, avoids that problem entirely — this was actually caught by
testing exactly this failure mode before shipping, not theoretical.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

RANDOM_STATE = 42


def build_rf():
    return RandomForestClassifier(
        n_estimators=300, max_depth=6, class_weight="balanced", random_state=RANDOM_STATE,
    )


def build_logreg():
    return make_pipeline(
        StandardScaler(),
        LogisticRegression(C=0.1, class_weight="balanced", max_iter=2000, random_state=RANDOM_STATE),
    )


def build_xgb():
    return XGBClassifier(
        n_estimators=200,
        max_depth=3,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_lambda=2.0,
        scale_pos_weight=4.0,
        eval_metric="logloss",
        random_state=RANDOM_STATE,
    )


class EnsembleModel:
    """
    Simple unweighted average of RandomForest, LogisticRegression, and
    XGBoost probabilities. No new learned parameters beyond the three base
    models — just averages their outputs, so it can't overfit any harder
    than the worst of the three, and variance reduction from averaging
    independent-ish models usually buys a small, safe AUC gain.
    """

    def __init__(self):
        self.rf = build_rf()
        self.lr = build_logreg()
        self.xgb = build_xgb()

    def fit(self, X, y):
        self.rf.fit(X, y)
        self.lr.fit(X, y)
        self.xgb.fit(X, y)
        return self

    def predict_proba(self, X):
        p_rf = self.rf.predict_proba(X)[:, 1]
        p_lr = self.lr.predict_proba(X)[:, 1]
        p_xgb = self.xgb.predict_proba(X)[:, 1]
        p_avg = (p_rf + p_lr + p_xgb) / 3.0
        return np.column_stack([1.0 - p_avg, p_avg])


def build_ensemble():
    return EnsembleModel()
