'use client';

import React, { useState } from 'react';
import { predictFraud } from '../utils/api';
import type { PredictionResponse } from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

interface FormData {
  distance_from_home: string;
  distance_from_last_transaction: string;
  ratio_to_median_purchase_price: string;
  repeat_retailer: boolean;
  used_chip: boolean;
  used_pin_number: boolean;
  online_order: boolean;
}

const initialFormData: FormData = {
  distance_from_home: '',
  distance_from_last_transaction: '',
  ratio_to_median_purchase_price: '',
  repeat_retailer: false,
  used_chip: false,
  used_pin_number: false,
  online_order: false,
};

export default function PredictionPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const numericFields = {
      'Distance from home': formData.distance_from_home,
      'Distance from last transaction': formData.distance_from_last_transaction,
      'Ratio to median purchase price': formData.ratio_to_median_purchase_price,
    };

    for (const [field, value] of Object.entries(numericFields)) {
      if (!value) {
        setError(`${field} is required`);
        return false;
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        setError(`${field} must be a positive number`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Convert form data to the format expected by the API
      const predictionData = {
        distance_from_home: parseFloat(formData.distance_from_home),
        distance_from_last_transaction: parseFloat(formData.distance_from_last_transaction),
        ratio_to_median_purchase_price: parseFloat(formData.ratio_to_median_purchase_price),
        repeat_retailer: formData.repeat_retailer ? 1 : 0,
        used_chip: formData.used_chip ? 1 : 0,
        used_pin_number: formData.used_pin_number ? 1 : 0,
        online_order: formData.online_order ? 1 : 0,
      };

      console.log('Sending prediction request with data:', predictionData);
      const response = await predictFraud(predictionData);
      console.log('Received prediction response:', response);
      setResult(response);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setResult(null);
    setError(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Fraud Detection Prediction</h1>
      
      {error && <Error message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
        {/* Numeric Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance from Home (miles)
            </label>
            <input
              type="number"
              name="distance_from_home"
              value={formData.distance_from_home}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              step="any"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance from Last Transaction (miles)
            </label>
            <input
              type="number"
              name="distance_from_last_transaction"
              value={formData.distance_from_last_transaction}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              step="any"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ratio to Median Purchase Price
            </label>
            <input
              type="number"
              name="ratio_to_median_purchase_price"
              value={formData.ratio_to_median_purchase_price}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              step="any"
              min="0"
            />
          </div>
        </div>

        {/* Checkbox Inputs */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="repeat_retailer"
                checked={formData.repeat_retailer}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Repeat Retailer</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="used_chip"
                checked={formData.used_chip}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Used Chip</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="used_pin_number"
                checked={formData.used_pin_number}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Used PIN Number</span>
            </label>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="online_order"
                checked={formData.online_order}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Online Order</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Predict
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
          <div className="space-y-4">
            <div>
              <p className="text-lg">
                Prediction: {' '}
                <span className={result.prediction === 1 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {result.prediction === 1 ? 'Fraudulent' : 'Legitimate'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-lg">
                Probability: {(result.probability * 100).toFixed(2)}%
              </p>
            </div>
            {result.message && (
              <div className="text-gray-600">
                <p>{result.message}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
