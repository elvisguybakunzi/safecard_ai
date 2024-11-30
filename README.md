# SafeCard AI - Credit Card Fraud Detection System

SafeCard AI is a comprehensive machine learning-based credit card fraud detection system that helps financial institutions and businesses identify potentially fraudulent transactions in real-time. The system combines advanced machine learning algorithms with an intuitive user interface to provide accurate fraud predictions and insights.

## Project Overview

The project consists of three main components:
1. Machine Learning Model (Scikit-learn)
2. FastAPI Backend
3. Next.js Frontend

### Key Features

- Real-time fraud detection predictions
- Interactive visualization of model insights
- Model retraining capabilities with new data
- Comprehensive feature importance analysis
- User-friendly interface for transaction analysis
- Detailed model performance metrics

## Project Structure

```
safecard_ai/
├── backend/               # FastAPI backend server
│   ├── data/             # Training and test datasets
│   ├── ml_pipeline_functions/ # ML pipeline components
│   ├── models/           # Saved model files
|   ├── result_locust_100_user/ # Locust results for 100 users
|   ├── locustfile.py     # Locust load testing
│   ├── main.py          # FastAPI application
│   ├── requirements.txt  # Python dependencies
|   └── sample_data.csv   # Sample transaction data for load testing
│
├── frontend/             # Next.js frontend application
│   ├── app/             # Application components and pages
│   │   ├── components/  # Reusable UI components
│   │   ├── prediction/  # Prediction page
│   │   ├── retraining/  # Model retraining page
│   │   └── utils/       # Utility functions
│   ├── public/          # Static assets
│   └── package.json     # Node.js dependencies
│
└── model/               # Model development and training
    ├── data/           # Raw and processed datasets
    ├── saved_models/   # Trained model artifacts
    ├── saved_plots/    # Model performance visualizations
    └── model_training.ipynb # Model training notebook
```

## Live Demo

🚀 **Access the live application:**
- Frontend: [https://safecard-ai.vercel.app](https://safecard-ai.vercel.app)
- Backend API: [https://safecardai.onrender.com](https://safecardai.onrender.com)
- API Documentation: [https://safecardai.onrender.com/docs](https://safecardai.onrender.com/docs)
- Video Demonstration: [https://www.youtube.com/watch?v=UJZT0p3j7m8](https://www.youtube.com/watch?v=UJZT0p3j7m8)

### Docker Users

The application is also available as Docker images for easy deployment:

#### Docker Image
```bash
# Pull the image
docker pull elvisguy/safecard-ai:latest

# Run the container
docker run -p 3000:3000 elvisguy/safecard-ai:latest
```


## Technology Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- React for UI components

### Backend
- FastAPI for API endpoints
- Locust for load testing
- Scikit-learn for ML models
- Pandas for data processing
- Python 3.8+ (Recommended 3.11+)

### Machine Learning
- Scikit-learn for model development
- Random Forest Classifier as the main model
- Pandas & NumPy for data preprocessing
- Matplotlib & Seaborn for visualizations

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/elvisguybakunzi/safecard_ai.git
cd safecard_ai
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

run the locust file to run the load test

```bash
pip install locust
uvicorn main:app --reload # Run in one terminal
locust -f locustfile.py # Run in another terminal
```

3. Set up the frontend
```bash
cd frontend
pnpm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server
```bash
cd frontend
pnpm dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Prediction API
- POST `/predict` - Make fraud predictions
- POST `/upload` - Upload new training data
- POST `/retrain` - Retrain the model

## Model Performance

The current model achieves:
- Accuracy: ~95%
- Precision: ~93%
- Recall: ~92%
- F1 Score: ~92.5%

## Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Render.com
- Model: Deployed with the backend

## Acknowledgments

- Dataset: [Credit Card Fraud Detection Dataset](https://www.kaggle.com/datasets/dhanushnarayananr/credit-card-fraud)
- African Leadership University

## Contact

 Name - **Elvis Guy Bakunzi**

 School Email - [e.bakunzi@alustudent.com](mailto:e.bakunzi@alustudent.com)
 
 Personal Email - [guyelvisbakunzi@gmail.com](mailto:guyelvisbakunzi@gmail.com)

Project Link: [https://github.com/elvisguybakunzi/safecard_ai.git](https://github.com/elvisguybakunzi/safecard_ai.git)

Visit my personal Github profile: [https://github.com/Elvis-Guy](https://github.com/Elvis-Guy)  