'use client';

import React from 'react';
import Image from 'next/image';

export default function VisualizationsPage() {
  const visualizations = [
    {
      title: 'Feature Importance',
      description: 'Relative importance of each feature in fraud detection',
      imagePath: '/images/feature_importance.png',
    },
    {
      title: 'Confusion Matrix',
      description: 'Model performance visualization showing true vs predicted values',
      imagePath: '/images/confusion_matrix.png',
    },
    {
      title: 'ROC Curve',
      description: 'Receiver Operating Characteristic curve showing model performance',
      imagePath: '/images/roc_curve.png',
    },
    {
      title: 'Distribution Analysis',
      description: 'Distribution of transaction amounts for fraudulent vs legitimate transactions',
      imagePath: '/images/distribution.png',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Model Visualizations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visualizations.map((viz, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{viz.title}</h2>
              <p className="text-gray-600 mb-4">{viz.description}</p>
              <div className="relative h-64 bg-gray-100 rounded">
                <Image
                  src={viz.imagePath}
                  alt={viz.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding the Visualizations</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Importance</h3>
            <p className="text-gray-600">
              This chart shows which transaction characteristics are most influential in detecting fraud.
              Longer bars indicate features that have a stronger impact on the model's decisions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confusion Matrix</h3>
            <p className="text-gray-600">
              The confusion matrix displays the model's prediction accuracy by showing true positives,
              true negatives, false positives, and false negatives in a grid format.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ROC Curve</h3>
            <p className="text-gray-600">
              The ROC curve illustrates the trade-off between the true positive rate and false positive
              rate at various classification thresholds. A larger area under the curve indicates better
              model performance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution Analysis</h3>
            <p className="text-gray-600">
              This visualization compares the distribution of transaction amounts between fraudulent
              and legitimate transactions, helping identify patterns in fraudulent behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
