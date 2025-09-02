import React from 'react';
import Card from '../common/Card';

const InsightsPanel = () => {
  const insights = [
    { label: 'Total Patients', value: '24', change: '+3 this week' },
    { label: 'Sessions Today', value: '8', change: '2 remaining' },
    { label: 'Completion Rate', value: '94%', change: '+2% from last month' },
    { label: 'Avg Rating', value: '4.8', change: '⭐⭐⭐⭐⭐' }
  ];

  return (
    <Card title="Practice Insights">
      <div className="grid grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="text-center p-4 bg-ayur-light rounded-lg">
            <p className="text-2xl font-bold text-ayur-primary">{insight.value}</p>
            <p className="text-sm font-medium text-gray-700">{insight.label}</p>
            <p className="text-xs text-gray-500 mt-1">{insight.change}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default InsightsPanel;