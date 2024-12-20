'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { retrainModel, uploadFile } from '../utils/api';
import type { RetrainResponse } from '../utils/api';
import Loading from '../components/Loading';
import Error from '../components/Error';

interface Metrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface DataInfo {
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

export default function RetrainingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
    setMetrics(null);
    setDataInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setMetrics(null);
    setDataInfo(null);

    try {
      if (file) {
        const uploadResponse = await uploadFile(file);
        setDataInfo(uploadResponse.data_info);
        setSuccess('Dataset uploaded and analyzed successfully!');
      }
      const response = await retrainModel();
      setSuccess((prev) => `${prev}\nModel retrained successfully!`);
      if (response.metrics) {
        setMetrics(response.metrics);
      }
    } catch (err: unknown) {
      console.error('Prediction error:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 
                             err.response?.data?.detail || 
                             err.message || 
                             'An unexpected error occurred';
        setError(errorMessage);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Model Retraining</h1>

      {error && <Error message={error} />}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Training Data (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Upload a file</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">CSV up to 5MB</p>
              </div>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Retrain Model
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
      </div>

      {dataInfo && dataInfo.feature_stats && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Dataset Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="font-medium">Total Samples: {dataInfo.total_samples}</p>
              <p className="font-medium">Fraud Ratio: {(dataInfo.fraud_ratio * 100).toFixed(2)}%</p>
            </div>
            
            <div className="col-span-2">
              <h3 className="text-lg font-medium mb-2">Feature Statistics</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Std</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(dataInfo.feature_stats).map(([feature, stats]) => (
                      <tr key={feature}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{feature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.mean.toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.std.toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.min.toFixed(4)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stats.max.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {metrics && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Model Performance Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Accuracy: {(metrics.accuracy * 100).toFixed(2)}%</p>
              <p className="font-medium">Precision: {(metrics.precision * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="font-medium">Recall: {(metrics.recall * 100).toFixed(2)}%</p>
              <p className="font-medium">F1 Score: {(metrics.f1_score * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
