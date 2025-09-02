import React from 'react';
import Card from '../common/Card';

const ProgressWidget = ({ progress }) => {
  const completedSessions = progress?.sessionsCompleted || 0;
  const totalSessions = progress?.totalSessions || 1;
  const progressPercentage = progress?.progress || ((completedSessions / totalSessions) * 100);

  return (
    <Card title="Treatment Progress">
      <div className="space-y-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="#4A7C59" 
                strokeWidth="8" 
                fill="none"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-ayur-primary">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-ayur-primary">{completedSessions} of {totalSessions} Sessions</p>
          <p className="text-sm text-gray-600">{progress?.currentTreatment?.plan || 'Treatment Plan'}</p>
        </div>
        <div className="bg-gradient-to-r from-ayur-light to-white p-4 rounded-xl">
          <p className="text-sm font-medium text-ayur-primary mb-2">Current Plan</p>
          <p className="text-xs text-gray-600">{progress?.currentTreatment?.plan || 'Complete more sessions to track progress'}</p>
        </div>
      </div>
    </Card>
  );
};

export default ProgressWidget;