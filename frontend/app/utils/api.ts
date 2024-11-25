import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8000' });

export const predictFraud = async (data) => {
  const response = await api.post('/predict', data);
  return response.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/retrain', formData);
  return response.data;
};

export const retrainModel = async () => {
  const response = await api.post('/retrain');
  return response.data;
};
