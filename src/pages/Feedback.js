import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';
import api from '../services/api';

const Feedback = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    bookingId: ''
  });
  const [completedBookings, setCompletedBookings] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedBookings();
  }, []);

  const fetchCompletedBookings = async () => {
    try {
      const response = await api.get('/bookings/my?status=completed');
      const bookings = response.data.data?.bookings || [];
      setCompletedBookings(bookings.filter(b => !b.feedback));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookingId) {
      alert('Please select a session to review');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.put(`/bookings/${formData.bookingId}/feedback`, {
        rating: formData.rating,
        comment: formData.comment
      });
      
      setSubmitted(true);
      window.dispatchEvent(new Event('feedbackSubmitted'));
      
      setTimeout(() => {
        navigate('/patient');
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRating = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ayur-light via-white to-ayur-accent/20 flex items-center justify-center">
        <Card className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-gentle">✅</div>
          <h2 className="text-2xl font-bold text-ayur-primary mb-2">Thank You!</h2>
          <p className="text-gray-600">Your feedback has been submitted successfully.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-2xl mx-auto px-4 py-8">

        
        <Card title="Session Feedback" className="animate-slide-up">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Session to Review
            </label>
            <select
              value={formData.bookingId}
              onChange={(e) => setFormData({...formData, bookingId: e.target.value})}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
            >
              <option value="">Choose a completed session</option>
              {completedBookings.map(booking => (
                <option key={booking._id} value={booking._id}>
                  {booking.therapy} - {booking.practitioner?.name} - {new Date(booking.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Your Experience
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRating(star)}
                    className={`text-3xl ${
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {formData.rating > 0 && `${formData.rating} out of 5 stars`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Comments
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="4"
                placeholder="How was your session? Share your experience..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ayur-primary hover:bg-ayur-secondary text-white py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={formData.rating === 0 || loading}
            >
              Submit Feedback
            </button>
          </form>
        </Card>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default Feedback;