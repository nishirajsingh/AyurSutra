import React from 'react';
import Card from '../common/Card';

const InsightsPanel = ({ dashboardStats, bookings, patients }) => {
  const completionRate = bookings.length > 0 ? 
    Math.round((bookings.filter(b => b.status === 'completed').length / bookings.length) * 100) : 0;
  
  const thisWeekBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return bookingDate >= weekAgo;
  }).length;
  
  const insights = [
    { 
      label: 'Total Patients', 
      value: patients?.length || dashboardStats?.totalPatients || 0, 
      change: `${thisWeekBookings} new this week` 
    },
    { 
      label: 'Sessions Today', 
      value: dashboardStats?.todayBookings || 0, 
      change: `${bookings.filter(b => b.status === 'pending').length} pending` 
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      change: `${bookings.filter(b => b.status === 'completed').length} completed` 
    },
    { 
      label: 'Monthly Revenue', 
      value: `₹${dashboardStats?.monthlyRevenue ? (dashboardStats.monthlyRevenue >= 1000 ? (dashboardStats.monthlyRevenue / 1000).toFixed(1) + 'K' : dashboardStats.monthlyRevenue) : '0'}`, 
      change: `${dashboardStats?.monthlyBookings || 0} sessions` 
    }
  ];

  return (
    <Card title="Practice Insights">
      <div className="grid grid-cols-2 gap-4 mb-6">
        {insights.map((insight, index) => (
          <div key={index} className="text-center p-4 bg-ayur-light rounded-lg">
            <p className="text-2xl font-bold text-ayur-primary">{insight.value}</p>
            <p className="text-sm font-medium text-gray-700">{insight.label}</p>
            <p className="text-xs text-gray-500 mt-1">{insight.change}</p>
          </div>
        ))}
      </div>
      
      {/* Therapy Performance */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-ayur-primary mb-3">Popular Therapies</h4>
        <div className="space-y-2">
          {Object.entries(
            bookings.reduce((acc, booking) => {
              acc[booking.therapy] = (acc[booking.therapy] || 0) + 1;
              return acc;
            }, {})
          ).sort(([,a], [,b]) => b - a).slice(0, 5).map(([therapy, count]) => (
            <div key={therapy} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{therapy}</span>
              <span className="text-sm text-ayur-primary">{count} sessions</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rating Breakdown */}
      {dashboardStats?.avgRating > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-ayur-primary mb-3">Rating Overview</h4>
          <div className="text-center p-4 bg-ayur-light rounded-lg">
            <div className="text-3xl font-bold text-ayur-primary mb-2">
              {dashboardStats.avgRating}/5.0
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${
                  i < Math.round(dashboardStats.avgRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">{dashboardStats.totalRatings} reviews</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default InsightsPanel;