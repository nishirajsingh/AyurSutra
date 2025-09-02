import React from 'react';
import Card from '../common/Card';

const ChartWidget = () => {
  return (
    <Card title="Recovery Milestones">
      <div className="h-64 bg-gradient-to-br from-ayur-light/30 to-white rounded-xl flex items-center justify-center border border-ayur-accent/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-ayur-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">📈</span>
          </div>
          <p className="text-lg font-semibold text-ayur-primary mb-2">Wellness Tracking</p>
          <p className="text-sm text-gray-600 mb-4">Visual insights into your healing journey</p>
          <button className="px-6 py-2 bg-ayur-primary text-white rounded-lg text-sm font-medium hover:bg-ayur-secondary transition-colors duration-300">
            View Detailed Charts
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ChartWidget;