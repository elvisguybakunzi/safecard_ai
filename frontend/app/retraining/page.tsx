'use client';

import React, { useState } from 'react';
import { uploadFile, retrainModel } from '@/utils/api';

const RetrainingPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleRetrain = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }
    setLoading(true);
    try {
      const uploadResponse = await uploadFile(file);
      const retrainResponse = await retrainModel();
      setMessage(retrainResponse.message);
    } catch (error) {
      setMessage('Error occurred during retraining.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Model Retraining</h1>
      <div className="bg-white shadow p-6 rounded-lg space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg w-full p-2"
        />
        <button
          onClick={handleRetrain}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? 'Retraining...' : 'Start Retraining'}
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default RetrainingPage;
