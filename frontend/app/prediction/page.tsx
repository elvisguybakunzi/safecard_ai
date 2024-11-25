'use client';

import React, { useState } from 'react';
import { predictFraud } from '../utils/api';
import type { PredictionResponse } from '../utils/api';

interface FormData {
  distance_from_home: string;
  distance_from_last_transaction: string;
  ratio_to_median_purchase_price: string;
  repeat_retailer: boolean;
  used_chip: boolean;
  used_pin_number: boolean;
  online_order: boolean;
}

const PredictionPage = () => {
  const [formData, setFormData] = useState<FormData>({
    distance_from_home: '',
    distance_from_last_transaction: '',
    ratio_to_median_purchase_price: '',
    repeat_retailer: false,
    used_chip: false,
    used_pin_number: false,
    online_order: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const numericData = {
        ...formData,
        distance_from_home: parseFloat(formData.distance_from_home),
        distance_from_last_transaction: parseFloat(formData.distance_from_last_transaction),
        ratio_to_median_purchase_price: parseFloat(formData.ratio_to_median_purchase_price),
      };
      const response = await predictFraud(numericData);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Fraud Prediction
      </h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded-lg">
        {/* Numeric inputs */}
        {['distance_from_home', 'distance_from_last_transaction', 'ratio_to_median_purchase_price'].map((key) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium text-gray-700">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              id={key}
              name={key}
              type="number"
              step="any"
              value={formData[key as keyof FormData]}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        
        {/* Boolean inputs */}
        {['repeat_retailer', 'used_chip', 'used_pin_number', 'online_order'].map((key) => (
          <div key={key} className="flex items-center">
            <input
              id={key}
              name={key}
              type="checkbox"
              checked={formData[key as keyof FormData]}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor={key} className="ml-2 text-sm font-medium text-gray-700">
              {key.replace(/_/g, ' ')}
            </label>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-white shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Prediction Result</h2>
          <p className="text-lg">
            Fraud Probability: {(result.probability * 100).toFixed(2)}%
          </p>
          <p className="text-lg mt-2">
            Prediction: {result.prediction === 1 ? 'Fraudulent' : 'Legitimate'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
