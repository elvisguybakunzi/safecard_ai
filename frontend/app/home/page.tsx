import React from 'react';

const HomePage = () => {
  const stats = [
    { title: 'Total Transactions', value: '12,345' },
    { title: 'Fraud Cases Detected', value: '234' },
    { title: 'Accuracy', value: '98.76%' },
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-lg p-6 text-center border border-gray-200"
          >
            <h2 className="text-lg font-bold text-gray-700">{stat.title}</h2>
            <p className="text-2xl font-extrabold text-blue-600">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
