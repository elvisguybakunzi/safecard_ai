import numpy as np
from typing import Dict, Any
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, 
    classification_report, 
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score
)

class ModelTrainer:
    def __init__(self):
        self.model = RandomForestClassifier(
            class_weight='balanced',
            n_estimators=100,
            random_state=42
        )

    def train(self, X_train, y_train):
        """Train the model"""
        self.model.fit(X_train, y_train)

    def evaluate(self, X_test, y_test) -> Dict[str, Any]:
        """Comprehensive model evaluation"""
        y_pred = self.model.predict(X_test)
        
        return {
            'accuracy': accuracy_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred, average='weighted'),
            'precision': precision_score(y_test, y_pred, average='weighted'),
            'recall': recall_score(y_test, y_pred, average='weighted'),
            'classification_report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist()
        }

    def save_model(self, filepath: str = 'models/classifier.pkl'):
        """Save the trained model"""
        joblib.dump(self.model, filepath)

    @classmethod
    def load_model(cls, filepath: str = 'models/classifier.pkl'):
        """Load a saved model"""
        return joblib.load(filepath)
