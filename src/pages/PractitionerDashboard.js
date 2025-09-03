import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import CalendarView from '../components/practitioner/CalendarView';
import PatientList from '../components/practitioner/PatientList';
import InsightsPanel from '../components/practitioner/InsightsPanel';
import { NAVIGATION_ITEMS } from '../constants';
import api from '../services/api';

const PractitionerDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'practitioner') {
      navigate('/login');
      return;
    }
    
    fetchBookings();
    fetchDashboardStats();
    fetchPatients();
    
    // Set up real-time data refresh every 5 seconds for immediate updates
    const interval = setInterval(() => {
      fetchDashboardStats();
      fetchBookings();
      fetchPatients();
    }, 5000);
    
    // Also refresh when window gains focus or booking is created
    const handleFocus = () => {
      fetchDashboardStats();
      fetchBookings();
      fetchPatients();
    };
    
    const handleBookingCreated = () => {
      fetchDashboardStats();
      fetchBookings();
      fetchPatients();
    };
    
    const handleFeedbackUpdate = () => {
      fetchDashboardStats();
      fetchBookings();
      fetchPatients();
    };
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('bookingCreated', handleBookingCreated);
    window.addEventListener('feedbackSubmitted', handleFeedbackUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bookingCreated', handleBookingCreated);
      window.removeEventListener('feedbackSubmitted', handleFeedbackUpdate);
    };
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data.data?.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/bookings/my');
      // Extract unique patients from bookings
      const uniquePatients = [];
      const patientIds = new Set();
      
      response.data.data?.bookings?.forEach(booking => {
        if (booking.patient && !patientIds.has(booking.patient._id)) {
          patientIds.add(booking.patient._id);
          uniquePatients.push({
            ...booking.patient,
            lastSession: booking.date,
            therapy: booking.therapy,
            status: booking.status
          });
        }
      });
      
      setPatients(uniquePatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/bookings/dashboard-stats');
      setDashboardStats(response.data.data?.stats || {});
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardStats({});
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      alert(`Booking ${status} successfully!`);
      fetchBookings();
      fetchDashboardStats();
    } catch (error) {
      alert(`Error updating booking status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Today's Sessions</p>
                    <p className="text-3xl font-bold">{dashboardStats?.todayBookings || 0}</p>
                    <p className="text-blue-100 text-sm">{bookings.filter(b => new Date(b.date).toDateString() === new Date().toDateString()).length} total</p>
                  </div>
                  <div className="text-4xl opacity-80">📅</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Patients</p>
                    <p className="text-3xl font-bold">{patients.length}</p>
                    <p className="text-green-100 text-sm">All time</p>
                  </div>
                  <div className="text-4xl opacity-80">👥</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avg Rating</p>
                    <p className="text-3xl font-bold">{dashboardStats?.avgRating || '0.0'}</p>
                    <p className="text-purple-100 text-sm">{dashboardStats?.totalRatings || 0} reviews</p>
                  </div>
                  <div className="text-4xl opacity-80">🏆</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Revenue</p>
                    <p className="text-3xl font-bold">₹{dashboardStats?.monthlyRevenue ? (dashboardStats.monthlyRevenue >= 1000 ? (dashboardStats.monthlyRevenue / 1000).toFixed(1) + 'K' : dashboardStats.monthlyRevenue) : '0'}</p>
                    <p className="text-orange-100 text-sm">This month</p>
                  </div>
                  <div className="text-4xl opacity-80">💰</div>
                </div>
              </div>
            </div>
            {/* Active Bookings */}
            {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-ayur-primary mb-4">
                  Active Bookings ({bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length})
                </h3>
                <div className="space-y-3">
                  {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-ayur-primary text-white rounded-full flex items-center justify-center font-semibold">
                            {booking.patient?.name?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{booking.patient?.name || 'Patient'}</p>
                            <p className="text-sm text-gray-600">{booking.therapy} • ₹{booking.amount}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </p>
                            <p className="text-xs text-gray-400">Duration: {booking.duration} minutes</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                              disabled={loading}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                              disabled={loading}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Feedback */}
            {bookings.filter(b => b.feedback).length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-ayur-primary mb-4">
                  Recent Feedback ({bookings.filter(b => b.feedback).length})
                </h3>
                <div className="space-y-3">
                  {bookings.filter(b => b.feedback).slice(0, 3).map((booking) => (
                    <div key={booking._id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{booking.patient?.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${
                                  i < booking.feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{booking.therapy}</p>
                          {booking.feedback.comment && (
                            <p className="text-sm text-gray-600 italic">"{booking.feedback.comment}"</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(booking.feedback.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CalendarView bookings={bookings} />
              </div>
              <div>
                <PatientList patients={patients} />
              </div>
            </div>
          </div>
        );
      case 'calendar':
        return <CalendarView bookings={bookings} />;
      case 'patients':
        return <PatientList patients={patients} />;
      case 'insights':
        return <InsightsPanel dashboardStats={dashboardStats} bookings={bookings} patients={patients} />;
      case 'insights':
        return <InsightsPanel dashboardStats={dashboardStats} bookings={bookings} patients={patients} />;
      default:
        return <div className="card">Dashboard</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-ayur-light/30 via-white to-ayur-accent/10">
      <Sidebar 
        items={NAVIGATION_ITEMS.PRACTITIONER}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={`Dr. ${JSON.parse(localStorage.getItem('user') || '{}').name || 'Practitioner'} Dashboard`} userType="practitioner" onLogout={handleLogout} />
        <main className="flex-1 p-4 overflow-auto">
          <div className="max-w-full">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-ayur-primary mb-1">
                  Good morning, Dr. {JSON.parse(localStorage.getItem('user') || '{}').name || 'Doctor'}!
                </h2>
                <p className="text-sm text-gray-600">
                  Ayurveda Specialist • Manage your practice and help patients
                </p>
              </div>
              <button
                onClick={() => {
                  fetchDashboardStats();
                  fetchBookings();
                  fetchPatients();
                }}
                className="px-4 py-2 bg-ayur-primary text-white rounded-lg hover:bg-ayur-secondary transition-colors duration-200 text-sm"
              >
                🔄 Refresh
              </button>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PractitionerDashboard;