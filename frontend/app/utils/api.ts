import axios, { AxiosError } from 'axios';

export interface PredictionData {
  distance_from_home: number;
  distance_from_last_transaction: number;
  ratio_to_median_purchase_price: number;
  repeat_retailer: number;
  used_chip: number;
  used_pin_number: number;
  online_order: number;
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  message?: string;
}

export interface RetrainResponse {
  success: boolean;
  message: string;
  metrics?: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
}

const api = axios.create({
  baseURL: 'https://safecardai.onrender.com',  
  timeout: 60000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. The server might be starting up, please try again in a minute.');
    }
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
);

export const predictFraud = async (data: PredictionData): Promise<PredictionResponse> => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

export const uploadFile = async (file: File): Promise<RetrainResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const retrainModel = async (): Promise<RetrainResponse> => {
  try {
    const response = await api.post('/retrain');
    return response.data;
  } catch (error) {
    console.error('Retrain error:', error);
    throw error;
  }
};
