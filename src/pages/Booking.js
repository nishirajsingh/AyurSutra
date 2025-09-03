import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';
import { TIME_SLOTS } from '../constants';
import api from '../services/api';

const Booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    therapy: '',
    practitioner: '',
    date: '',
    timeSlot: '',
    notes: ''
  });
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);
  const [practitioners, setPractitioners] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPractitioners();
    fetchTherapies();
  }, []);

  useEffect(() => {
    if (formData.practitioner && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.practitioner, formData.date, fetchAvailableSlots]);

  const fetchPractitioners = async () => {
    try {
      const response = await api.get('/practitioners');
      console.log('Practitioners response:', response.data);
      
      // Handle different response structures - practitioners API returns array directly
      const practitionersData = response.data.data?.practitioners || response.data || [];
      setPractitioners(practitionersData);
    } catch (error) {
      console.error('Error fetching practitioners:', error);
      // Set default practitioners if API fails
      setPractitioners([
        { 
          _id: '1', 
          name: 'Dr. Priya Sharma', 
          specialization: 'Panchakarma Specialist',
          experience: '15 years',
          consultationFee: 1500
        }
      ]);
    }
  };

  const fetchTherapies = async () => {
    try {
      const response = await api.get('/therapies');
      console.log('Therapies response:', response.data);
      
      // Handle different response structures
      const therapiesData = response.data.data?.therapies || response.data.therapies || response.data || [];
      setTherapies(therapiesData);
    } catch (error) {
      console.error('Error fetching therapies:', error);
      // Set default therapies if API fails
      setTherapies([
        { name: 'Abhyanga', price: 2500, description: 'Full body oil massage' },
        { name: 'Shirodhara', price: 3000, description: 'Oil pouring therapy' },
        { name: 'Panchakarma', price: 5000, description: 'Complete detox program' }
      ]);
    }
  };

  const fetchAvailableSlots = useCallback(async () => {
    try {
      const response = await api.get(`/practitioners/available-slots?practitionerId=${formData.practitioner}&date=${formData.date}`);
      setAvailableSlots(response.data.data.availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots(TIME_SLOTS); // Fallback to all slots
    }
  }, [formData.practitioner, formData.date]);

  const calculatePrice = () => {
    const therapy = therapies.find(t => t.name === formData.therapy || t._id === formData.therapy);
    return therapy ? (therapy.durations?.[0]?.price || therapy.price || 0) : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedTherapy = therapies.find(t => t.name === formData.therapy || t._id === formData.therapy);
      const bookingData = {
        practitioner: formData.practitioner,
        therapyType: formData.therapy,
        date: formData.date,
        time: formData.timeSlot,
        duration: selectedTherapy?.durations?.[0]?.minutes || selectedTherapy?.duration || 60,
        amount: calculatePrice(),
        notes: formData.notes
      };

      await api.post('/bookings', bookingData);
      alert('Booking created successfully! The practitioner will be notified.');
      
      // Trigger immediate refresh for real-time updates
      window.dispatchEvent(new Event('bookingCreated'));
      
      navigate('/patient');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
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


  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />
      <div className="max-w-4xl mx-auto px-4 py-8">

        
        <Card title="Book Your Therapy Session" className="animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Therapy Type
              </label>
              <select
                name="therapy"
                value={formData.therapy}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
              >
                <option value="">Select Therapy</option>
                {therapies.length > 0 ? therapies.map(therapy => (
                  <option key={therapy._id || therapy.name} value={therapy.name}>
                    {therapy.name} - ₹{therapy.durations?.[0]?.price || therapy.price || 'Price not set'}
                  </option>
                )) : (
                  <option disabled>Loading therapies...</option>
                )}
              </select>
              {formData.therapy && (() => {
                const therapy = therapies.find(t => t.name === formData.therapy || t._id === formData.therapy);
                return therapy ? (
                  <div className="mt-2 p-3 bg-ayur-light rounded-lg">
                    <p className="text-sm text-ayur-primary font-medium">
                      {therapy.description || 'Traditional Ayurvedic therapy'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Duration: {therapy.durations?.[0]?.minutes || therapy.duration || 60} minutes | 
                      Category: {therapy.category || 'Ayurveda'}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
              />
            </div>

            {/* Practitioner Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Practitioner
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {practitioners.length > 0 ? practitioners.map(practitioner => (
                  <div
                    key={practitioner._id}
                    onClick={() => {
                      setFormData({...formData, practitioner: practitioner._id});
                      setSelectedPractitioner(practitioner);
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      formData.practitioner === practitioner._id
                        ? 'border-ayur-primary bg-ayur-light shadow-md'
                        : 'border-gray-200 hover:border-ayur-accent hover:shadow-sm'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2">👨⚕️</div>
                      <h4 className="font-semibold text-ayur-primary">{practitioner.name}</h4>
                      <p className="text-sm text-gray-600">Ayurveda Specialist</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">10+ years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fee:</span>
                        <span className="font-medium">₹{practitioner.consultationFee || 1500}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">{practitioner.stats?.avgRating > 0 ? practitioner.stats.avgRating.toFixed(1) : 'New'} {practitioner.stats?.avgRating > 0 ? '⭐' : '🆕'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patients:</span>
                        <span className="font-medium">{practitioner.stats?.appointmentCount || 0}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">BAMS, MD (Ayurveda)</p>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👨⚕️</div>
                    <p>Loading practitioners...</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(availableSlots.length > 0 ? availableSlots : TIME_SLOTS).map(time => {
                  const available = availableSlots.includes(time) || availableSlots.length === 0;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => available && setFormData({...formData, timeSlot: time})}
                      disabled={!available || !selectedPractitioner}
                      className={`p-3 rounded-lg border text-sm font-medium ${
                        formData.timeSlot === time
                          ? 'bg-ayur-primary text-white border-ayur-primary'
                          : available && selectedPractitioner
                          ? 'bg-white text-ayur-primary border-ayur-primary hover:bg-ayur-light'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      {time}
                      {!available && <div className="text-xs">Booked</div>}
                    </button>
                  );
                })}
              </div>
              {!selectedPractitioner && (
                <p className="text-sm text-gray-500 mt-2">Please select a practitioner first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any specific requirements or health conditions to mention..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-primary focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ayur-primary hover:bg-ayur-secondary text-white py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || !formData.therapy || !formData.practitioner || !formData.date || !formData.timeSlot}
            >
              {loading ? 'Booking...' : `Book Session - ₹${calculatePrice()}`}
            </button>
          </form>
        </Card>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default Booking;