'use client';

import React from 'react';
import Image from 'next/image';

export default function VisualizationsPage() {
  const visualizations = [
    {
      title: 'Correlation Heatmap',
      description: 'Relative importance of each feature in fraud detection',
      imagePath: '/images/correlation_heatmap.png',
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
      title: 'Violin Plot of Distance from Home',
      description: 'Violin plot that visualizes the distribution of the distance_from_home feature for two categories of a variable labeled fraud (values 0.0 and 1.0).',
      imagePath: '/images/distance_from_home_violinplot.png',
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Correlation Heatmap</h3>
            <p className="text-gray-600">
            This heatmap shows feature correlations, highlighting that ratio_to_median_purchase_price (0.45), online_order (0.29), and distance_from_home (0.21) have the strongest positive correlations with fraud. Other features, like used_chip (-0.09) and used_pin_number (-0.15), have weak or negative correlations, suggesting they may be less predictive for fraud detection.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confusion Matrix</h3>
            <p className="text-gray-600">
            This confusion matrix shows the performance of a fraud detection model. It correctly classified 480 "No Fraud" cases and 115 "Fraud" cases. There were no false positives (incorrectly predicting fraud) and only 5 false negatives (missing fraud cases). The model achieves high accuracy (99.17%), perfect precision (100%), and strong recall (95.83%), making it very effective at identifying fraud with minimal errors.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ROC Curve</h3>
            <p className="text-gray-600">
            This ROC curve shows the performance of a Random Forest Classifier with an AUC of 1.00, indicating perfect classification. The model achieves a high true positive rate (sensitivity) while maintaining a low false positive rate, effectively distinguishing between fraud and no-fraud cases with no errors.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Violin Plot of Distance from Home</h3>
            <p className="text-gray-600">
            A violin plot is a data visualization that combines aspects of a box plot and a kernel density plot to show the distribution of a dataset across different categories.

            This violin plot compares the distributions of distance_from_home for fraudulent (orange) and non-fraudulent (blue) transactions. Both categories are concentrated around shorter distances, but their distributions differ slightly, suggesting that distance_from_home might help in distinguishing between fraud and non-fraud cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
