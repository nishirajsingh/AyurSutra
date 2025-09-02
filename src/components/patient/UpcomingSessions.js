import React from 'react';
import Card from '../common/Card';

const UpcomingSessions = ({ sessions = [] }) => {
  return (
    <Card title="Upcoming Sessions">
      <div className="space-y-3">
        {sessions.length > 0 ? sessions.map((session) => (
          <div key={session.id} className="flex justify-between items-center p-3 bg-ayur-light rounded-lg">
            <div>
              <p className="font-medium text-ayur-primary">{session.therapy}</p>
              <p className="text-sm text-gray-600">{session.practitioner}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{new Date(session.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">{session.time}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.status}
              </span>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>No upcoming sessions</p>
            <p className="text-sm">Book your first session to get started</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UpcomingSessions;