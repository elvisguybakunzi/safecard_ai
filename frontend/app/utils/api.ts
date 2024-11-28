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
  probabilities: {
    not_fraud: number;
    fraud: number;
  };
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

export interface DataInfo {
  total_samples: number;
  features: string[];
  fraud_ratio: number;
  feature_stats: {
    [key: string]: {
      mean: number;
      std: number;
      min: number;
      max: number;
    };
  };
}

export interface UploadResponse {
  message: string;
  data_info: DataInfo;
}


const api = axios.create({
  baseURL: 'https://safecardai.onrender.com',  
  timeout: 100000, 
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
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await api.post<PredictionResponse>('/predict', data);
      return response.data;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      // Wait for 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries exceeded');
};

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Max retries exceeded');
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
