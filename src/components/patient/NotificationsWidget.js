import React from 'react';
import Card from '../common/Card';

const NotificationsWidget = ({ notifications = [] }) => {
  return (
    <Card title="Notifications">
      <div className="space-y-3">
        {notifications.length > 0 ? notifications.map((notification) => (
          <div key={notification.id} className="p-4 bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-400 rounded-xl hover:shadow-sm transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'reminder' ? 'bg-blue-100' :
                notification.type === 'feedback' ? 'bg-green-100' :
                'bg-gray-100'
              }`}>
                <span className={`text-sm ${
                  notification.type === 'reminder' ? 'text-blue-600' :
                  notification.type === 'feedback' ? 'text-green-600' :
                  'text-gray-600'
                }`}>🔔</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔔</div>
            <p>No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
        <button className="w-full py-2 text-sm text-ayur-primary hover:text-ayur-secondary font-medium transition-colors duration-300">
          View All Notifications
        </button>
      </div>
    </Card>
  );
};

export default NotificationsWidget;