from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
import joblib
import os

from ml_pipeline_functions.preprocessing import DataPreprocessor
from ml_pipeline_functions.model import ModelTrainer

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://safecardai.vercel.app"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load preprocessor and model
try:
    preprocessor = DataPreprocessor.load_preprocessor('models/preprocessor.pkl')
    model = joblib.load('models/random_forest_model.pkl')
except Exception as e:
    print(f"Error loading models: {str(e)}")
    preprocessor = None
    model = None

# Define input schema with named features
class FraudPredictionData(BaseModel):
    distance_from_home: float
    distance_from_last_transaction: float
    ratio_to_median_purchase_price: float
    repeat_retailer: float
    used_chip: float
    used_pin_number: float
    online_order: float

# Define the predict endpoint
@app.post("/predict")
def predict(data: FraudPredictionData):
    try:
        if preprocessor is None or model is None:
            raise HTTPException(
                status_code=500,
                detail="Models not loaded. Please ensure model files exist and are valid."
            )
            
        # Convert input data into a NumPy array
        input_data = np.array([[
            data.distance_from_home,
            data.distance_from_last_transaction,
            data.ratio_to_median_purchase_price,
            data.repeat_retailer,
            data.used_chip,
            data.used_pin_number,
            data.online_order
        ]])
        
        # Preprocess the input data using only the scaler
        input_data_scaled = preprocessor.scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_data_scaled)[0]
        probabilities = model.predict_proba(input_data_scaled)[0]

        # Return the prediction and probabilities
        return {
            "prediction": int(prediction),
            "probabilities": {
                "not_fraud": float(probabilities[0]),
                "fraud": float(probabilities[1])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        os.makedirs('data/uploads', exist_ok=True)
        file_path = f'data/uploads/{file.filename}'
        
        with open(file_path, 'wb') as buffer:
            buffer.write(await file.read())
        
        # Preprocess data
        data_info = preprocessor.load_data(file_path)
        df = data_info['dataframe']
        
        # Get dataset statistics
        stats = {
            "total_samples": len(df),
            "features": data_info['features'],
            "fraud_ratio": float(df.iloc[:, -1].mean()),  # Assuming last column is target
            "feature_stats": {
                col: {
                    "mean": float(df[col].mean()),
                    "std": float(df[col].std()),
                    "min": float(df[col].min()),
                    "max": float(df[col].max())
                } for col in df.columns[:-1]  # Exclude target column
            }
        }
        
        return {
            "message": "File uploaded and analyzed successfully",
            "data_info": stats
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/retrain")
async def retrain_model():
    try:
        # Get the most recently uploaded file from the uploads directory
        upload_dir = 'data/uploads'
        if not os.path.exists(upload_dir):
            raise HTTPException(
                status_code=400, 
                detail="No dataset available. Please upload a dataset first."
            )
            
        files = os.listdir(upload_dir)
        if not files:
            raise HTTPException(
                status_code=400, 
                detail="No dataset available. Please upload a dataset first."
            )
            
        # Get the most recent file
        latest_file = max([os.path.join(upload_dir, f) for f in files], key=os.path.getctime)
        
        # Load and preprocess the data
        data_info = preprocessor.load_data(latest_file)
        preprocessed_data = preprocessor.preprocess(data_info['dataframe'])
        
        # Train new model
        trainer = ModelTrainer()
        trainer.train(
            preprocessed_data['X_train'], 
            preprocessed_data['y_train']
        )
        
        # Evaluate and save
        evaluation_metrics = trainer.evaluate(
            preprocessed_data['X_test'], 
            preprocessed_data['y_test']
        )
        
        # Save the new model and preprocessor
        trainer.save_model('models/random_forest_model.pkl')
        preprocessor.save_preprocessor('models/preprocessor.pkl')
        
        # Update the global model reference
        global model
        model = trainer.model
        
        return {
            "message": "Model retrained successfully",
            "metrics": {
                "accuracy": float(evaluation_metrics['accuracy']),
                "precision": float(evaluation_metrics['precision']),
                "recall": float(evaluation_metrics['recall']),
                "f1_score": float(evaluation_metrics['f1_score'])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
