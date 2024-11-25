'use client';

import React, { useState } from 'react';
import { predictFraud } from '@/utils/api';

const PredictionPage = () => {
  const [formData, setFormData] = useState({
    distance_from_home: '',
    distance_from_last_transaction: '',
    ratio_to_median_purchase_price: '',
    repeat_retailer: '',
    used_chip: '',
    used_pin_number: '',
    online_order: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await predictFraud(formData);
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Fraud Prediction
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded-lg">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium text-gray-700">
              {key.replace(/_/g, ' ')}
            </label>
            <input
              id={key}
              name={key}
              type="number"
              step="any"
              value={formData[key]}
              onChange={handleInputChange}
              className="mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Predict'}
        </button>
      </form>
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold">Prediction Result</h2>
          <p>Fraud Probability: {result.probabilities.fraud}</p>
          <p>Not Fraud Probability: {result.probabilities.not_fraud}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
