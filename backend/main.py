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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load preprocessor and model
preprocessor = DataPreprocessor.load_preprocessor('models/preprocessor.pkl')
model = ModelTrainer.load_model('models/random_forest_model.pkl')

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
        
        # Preprocess the input data
        input_data_scaled = preprocessor.scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_data_scaled)[0]
        probabilities = model.predict_proba(input_data_scaled)[0]

        # Return the prediction and probabilities
        return {
            "prediction": int(prediction),
            "probabilities": {
                "not_fraud": probabilities[0],
                "fraud": probabilities[1]
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
        preprocessed_data = preprocessor.preprocess(data_info['dataframe'])
        
        return {
            "message": "File uploaded and preprocessed successfully",
            "data_info": {
                "features": data_info['features'],
                "total_samples": len(data_info['dataframe'])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/retrain")
async def retrain_model(file: UploadFile = File(None)):
    try:
        if file:
            # Use uploaded file for retraining
            file_path = f'data/uploads/{file.filename}'
            with open(file_path, 'wb') as buffer:
                buffer.write(await file.read())
            data_info = preprocessor.load_data(file_path)
        else:
            # Default to original dataset
            data_info = preprocessor.load_data()

        # Preprocess
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
        
        # trainer.save_model('models/classifier.pkl')
        # preprocessor.save_preprocessor('models/preprocessor.pkl')
        
        return {
            "message": "Model retrained successfully",
            "metrics": evaluation_metrics
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
