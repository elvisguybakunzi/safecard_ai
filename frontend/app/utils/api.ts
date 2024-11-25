import axios, { AxiosError } from 'axios';

interface PredictionData {
  distance_from_home: number;
  distance_from_last_transaction: number;
  ratio_to_median_purchase_price: number;
  repeat_retailer: boolean;
  used_chip: boolean;
  used_pin_number: boolean;
  online_order: boolean;
}

interface PredictionResponse {
  prediction: number;
  probability: number;
}

interface RetrainResponse {
  success: boolean;
  message: string;
}

const api = axios.create({ baseURL: 'https://safecardai.onrender.com/' });

export const predictFraud = async (data: PredictionData): Promise<PredictionResponse> => {
  try {
    const response = await api.post('/predict', data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to make prediction');
    }
    throw error;
  }
};

export const uploadFile = async (file: File): Promise<RetrainResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
    throw error;
  }
};

export const retrainModel = async (): Promise<RetrainResponse> => {
  try {
    const response = await api.post('/retrain');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to retrain model');
    }
    throw error;
  }
};
