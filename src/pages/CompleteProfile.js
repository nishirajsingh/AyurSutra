import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { LOGO_CONFIG } from '../constants';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    role: 'patient',
    address: '',
    dateOfBirth: '',
    gender: '',
    age: '',
    // Practitioner fields
    specialization: '',
    experience: '',
    qualification: '',
    licenseNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.updateProfile(formData);
      const { user: updatedUser } = response.data.data;
      
      // Update user in context
      login(localStorage.getItem('token'), updatedUser);

      // Redirect to appropriate dashboard
      if (updatedUser.role === 'patient') navigate('/patient');
      else if (updatedUser.role === 'practitioner') navigate('/practitioner');
      else navigate('/admin');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayur-light via-white to-ayur-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-12 h-12 bg-ayur-primary rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-xl text-white">{LOGO_CONFIG.icon}</span>
          </div>
          <h1 className="text-2xl font-bold text-ayur-primary">{LOGO_CONFIG.name}</h1>
          <p className="text-sm text-gray-600">Complete your profile</p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 animate-slide-up">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Welcome, {user?.name}!</p>
            <p className="text-xs text-gray-500">Please complete your profile to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'patient'})}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    formData.role === 'patient'
                      ? 'bg-white text-ayur-primary shadow-sm'
                      : 'text-gray-600 hover:text-ayur-primary'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'practitioner'})}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    formData.role === 'practitioner'
                      ? 'bg-white text-ayur-primary shadow-sm'
                      : 'text-gray-600 hover:text-ayur-primary'
                  }`}
                >
                  Practitioner
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number *"
              required
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
            />

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.role === 'patient' && (
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="1"
                max="120"
                className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
            )}

            {/* Practitioner-specific fields */}
            {formData.role === 'practitioner' && (
              <>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Specialization *"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Experience (years) *"
                    required
                    min="0"
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  />
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="License Number *"
                    required
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  />
                </div>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Qualification *"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                />
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ayur-primary hover:bg-ayur-secondary text-white py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Completing Profile...</span>
                </div>
              ) : (
                'Complete Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;