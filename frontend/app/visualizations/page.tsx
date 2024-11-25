'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const VisualizationPage = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Mock API data
      const data = {
        labels: ['Feature 1', 'Feature 2', 'Feature 3'],
        datasets: [
          {
            label: 'Fraud Cases',
            data: [20, 15, 30],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
        ],
      };
      setChartData(data);
    };
    fetchData();
  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Visualizations</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default VisualizationPage;
