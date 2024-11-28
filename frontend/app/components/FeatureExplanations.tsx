import React from 'react';

const FeatureExplanations: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding Transaction Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Distance from Home</h3>
            <p className="text-sm text-gray-600">The distance from home where the transaction happened. Measured in miles.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Distance from Last Transaction</h3>
            <p className="text-sm text-gray-600">The distance from where the last transaction occurred. Measured in miles.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Ratio to Median Purchase Price</h3>
            <p className="text-sm text-gray-600">Ratio of current purchase price compared to your median purchase price.</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Repeat Retailer</h3>
            <p className="text-sm text-gray-600">Indicates if the transaction is from a previously visited retailer.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Used Chip</h3>
            <p className="text-sm text-gray-600">Indicates if the transaction was made using the credit card's chip.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Used PIN Number</h3>
            <p className="text-sm text-gray-600">Indicates if a PIN number was used for the transaction.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-600">Online Order</h3>
            <p className="text-sm text-gray-600">Indicates if the transaction was an online purchase.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureExplanations;