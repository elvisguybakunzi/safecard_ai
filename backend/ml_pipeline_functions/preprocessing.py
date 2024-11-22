import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from typing import Tuple, Dict, Any

class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.imputer = SimpleImputer(strategy='mean')

    def load_data(self, data_path: str = None) -> Dict[str, Any]:
        """
        Load and prepare dataset
        Supports CSV files or defaults to a fraud detection sample dataset
        """
        if data_path:
            # Load from file
            if data_path.endswith('.csv'):
                df = pd.read_csv(data_path)
            else:
                raise ValueError("Unsupported file type")
        else:
            # Default to a fraud detection dataset
            raise ValueError("No dataset provided, and no default dataset implemented.")

        return {
            'dataframe': df,
            'features': df.columns[:-1].tolist(),
            'target_column': df.columns[-1]
        }

    def preprocess(self, 
                   df: pd.DataFrame, 
                   test_size: float = 0.3, 
                   random_state: int = 42
                   ) -> Dict[str, np.ndarray]:
        """
        Preprocessing pipeline for fraud detection
        """
        # Handle missing values
        df[df.columns] = self.imputer.fit_transform(df)

        # Separate features and target
        X = df.iloc[:, :-1]
        y = df.iloc[:, -1]

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=test_size, 
            random_state=random_state,
            stratify=y
        )

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        return {
            'X_train': X_train_scaled,
            'X_test': X_test_scaled,
            'y_train': y_train,
            'y_test': y_test
        }

    def save_preprocessor(self, filepath: str = 'models/preprocessor.pkl'):
        """Save preprocessing artifacts"""
        import joblib
        joblib.dump({
            'scaler': self.scaler,
            'imputer': self.imputer
        }, filepath)

    @classmethod
    def load_preprocessor(cls, filepath: str = 'models/preprocessor.pkl'):
        """Load preprocessing artifacts"""
        import joblib
        saved_artifacts = joblib.load(filepath)
        preprocessor = cls()
        preprocessor.scaler = saved_artifacts['scaler']
        preprocessor.imputer = saved_artifacts['imputer']
        return preprocessor
