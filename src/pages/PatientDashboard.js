import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import UpcomingSessions from '../components/patient/UpcomingSessions';
import ProgressWidget from '../components/patient/ProgressWidget';
import NotificationsWidget from '../components/patient/NotificationsWidget';
import ChartWidget from '../components/patient/ChartWidget';
import { NAVIGATION_ITEMS, TIME_SLOTS } from '../constants';
import api from '../services/api';

const PatientDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [practitioners, setPractitioners] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'patient') {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
    fetchBookings();
    fetchPractitioners();
    fetchTherapies();
    fetchNotifications();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/bookings/dashboard-stats');
      setDashboardData(response.data.data?.stats || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({});
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data.data?.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const fetchPractitioners = async () => {
    try {
      const response = await api.get('/practitioners');
      setPractitioners(response.data?.data?.practitioners || []);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
      setPractitioners([]);
    }
  };

  const fetchTherapies = async () => {
    try {
      const response = await api.get('/therapies');
      setTherapies(response.data?.data?.therapies || []);
    } catch (error) {
      console.error('Error fetching therapies:', error);
      setTherapies([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.slice(0, 5)); // Show latest 5
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ayur-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-ayur-primary to-ayur-secondary rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-ayur-light text-sm">Upcoming Sessions</p>
                    <p className="text-2xl font-bold">{dashboardData?.upcomingBookings || 0}</p>
                    <p className="text-ayur-light text-sm">Sessions scheduled</p>
                  </div>
                  <div className="text-4xl opacity-80">🌿</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-ayur-secondary to-ayur-accent rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-ayur-light text-sm">Total Sessions</p>
                    <p className="text-2xl font-bold">{dashboardData?.totalBookings || 0}</p>
                    <p className="text-ayur-light text-sm">All time bookings</p>
                  </div>
                  <div className="text-4xl opacity-80">📈</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-ayur-accent to-ayur-primary rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-ayur-light text-sm">Completed</p>
                    <p className="text-2xl font-bold">{dashboardData?.completedBookings || 0}</p>
                    <p className="text-ayur-light text-sm">Sessions finished</p>
                  </div>
                  <div className="text-4xl opacity-80">⭐</div>
                </div>
              </div>
            </div>
            {/* Recent Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-ayur-primary mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const getNotificationStyle = (type, priority) => {
                      if (type === 'confirmation') return 'border-green-400 bg-green-50';
                      if (type === 'cancellation') return 'border-red-400 bg-red-50';
                      if (type === 'booking_confirmation') return 'border-blue-400 bg-blue-50';
                      return priority === 'high' ? 'border-red-400 bg-red-50' :
                             priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                             'border-blue-400 bg-blue-50';
                    };
                    
                    return (
                      <div key={notification._id} className={`p-4 rounded-lg border-l-4 ${getNotificationStyle(notification.type, notification.priority)} ${!notification.isRead ? 'ring-2 ring-blue-200' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{notification.title}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="grid lg:grid-cols-2 gap-6">
              <UpcomingSessions sessions={dashboardData?.upcomingSessions || []} />
              <ProgressWidget progress={dashboardData?.progress} />
              <NotificationsWidget notifications={dashboardData?.notifications || []} />
              <ChartWidget />
            </div>
          </div>
        );
      case 'book':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-ayur-primary mb-6">Book New Session</h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Therapy Type
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary">
                    <option value="">Select Therapy</option>
                    {(therapies || []).map(therapy => (
                      <option key={therapy._id} value={therapy.name}>{therapy.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Practitioner
                  </label>
                  <div className="grid gap-3">
                    {(practitioners || []).slice(0, 3).map(practitioner => (
                      <div key={practitioner._id} className="p-3 border border-gray-200 rounded-lg hover:border-ayur-primary cursor-pointer transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">👨‍⚕️</span>
                          <div>
                            <p className="font-medium text-ayur-primary">{practitioner.name}</p>
                            <p className="text-sm text-gray-600">{practitioner.specialization}</p>
                            <p className="text-xs text-gray-500">{practitioner.experience} years exp</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary">
                      <option value="">Select Time</option>
                      {TIME_SLOTS.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button type="button" onClick={() => navigate('/booking')} className="w-full btn-primary">
                  Book Session
                </button>
              </form>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-ayur-primary mb-4">My Schedule</h3>
              <div className="space-y-3">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <div key={booking._id} className="flex justify-between items-center p-4 bg-ayur-light rounded-xl">
                    <div>
                      <p className="font-semibold text-ayur-primary">{booking.therapy}</p>
                      <p className="text-sm text-gray-600">{booking.practitioner?.name}</p>
                      <p className="text-xs text-gray-500">₹{booking.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No appointments scheduled</p>
                    <button onClick={() => setActiveItem('book')} className="mt-2 text-ayur-primary hover:underline">
                      Book your first session
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="space-y-6">
            <ProgressWidget progress={dashboardData?.progress} />
            <ChartWidget />
          </div>
        );
      case 'feedback':
        return (
          <div className="card">
            <h3 className="text-xl font-semibold text-ayur-primary mb-6">Session Feedback</h3>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Rate Your Experience
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className="text-3xl text-yellow-400 hover:scale-110 transition-transform">
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling?
                </label>
                <textarea 
                  rows="3" 
                  placeholder="Share your experience and any improvements you've noticed..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions
                </label>
                <textarea 
                  rows="2" 
                  placeholder="Any suggestions for improvement?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary resize-none"
                />
              </div>
              
              <button type="button" onClick={() => navigate('/feedback')} className="w-full btn-primary">
                Submit Feedback
              </button>
            </form>
          </div>
        );
      default:
        return <div className="card">Dashboard</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-ayur-light/30 via-white to-ayur-accent/10">
      <Sidebar 
        items={NAVIGATION_ITEMS.PATIENT}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Patient Dashboard" userType="patient" onLogout={handleLogout} />
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-full">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-ayur-primary mb-1">Welcome back!</h2>
              <p className="text-sm text-gray-600">Track your wellness journey and manage your sessions</p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;