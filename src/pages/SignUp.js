import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LOGO_CONFIG } from '../constants';
import { authAPI } from '../services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    specialization: '',
    experience: '',
    license: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    // Check if required fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    // Test API connectivity first
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      console.log('Testing API connectivity to:', apiUrl);
      
      const testResponse = await fetch(`${apiUrl}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!testResponse.ok) {
        throw new Error(`Backend server responded with status: ${testResponse.status}`);
      }
      
      const testData = await testResponse.json();
      console.log('✅ API connectivity test passed:', testData);
    } catch (connectError) {
      console.error('❌ API connectivity test failed:', connectError);
      alert(`Cannot connect to server at ${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}. Please ensure the backend is running.`);
      setIsLoading(false);
      return;
    }
    
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Submitting registration data:', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: userType
    });
    
    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: userType,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth
      };

      if (userType === 'patient') {
        if (!formData.gender) {
          alert('Please select gender for patient registration');
          return;
        }
        userData.gender = formData.gender;
      }

      if (userType === 'practitioner') {
        userData.specialization = formData.specialization;
        userData.experience = parseInt(formData.experience);
        userData.qualification = formData.license;
        userData.consultationFee = 1500;
      }

      const response = await authAPI.register(userData);
      
      const { token, data } = response.data;
      login(token, data.user);
      
      navigate(userType === 'patient' ? '/patient' : '/practitioner');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Registration failed';
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Network error: Cannot connect to server. Please check if the backend is running.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused: Backend server is not running on http://localhost:8000';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Registration failed: ${errorMessage}`);
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
          <p className="text-sm text-gray-600">Create your account</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 animate-slide-up">
          {/* User Type Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                userType === 'patient'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setUserType('practitioner')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                userType === 'practitioner'
                  ? 'bg-white text-ayur-primary shadow-sm'
                  : 'text-gray-600 hover:text-ayur-primary'
              }`}
            >
              Practitioner
            </button>
          </div>



          {/* Google Sign Up */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/google`;
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-200 rounded-xl hover:border-ayur-primary hover:bg-ayur-light/20 transition-all duration-300 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>

          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
              />
            </div>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
            />

            {/* Patient-specific fields */}
            {userType === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Practitioner-specific fields */}
            {userType === 'practitioner' && (
              <>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Specialization"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Experience (years)"
                    required
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  />
                  <input
                    type="text"
                    name="license"
                    value={formData.license}
                    onChange={handleChange}
                    placeholder="License Number"
                    required
                    className="px-3 py-2 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:bg-white transition-all duration-300 text-sm"
                  />
                </div>
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
                  <span>Creating account...</span>
                </div>
              ) : (
                `Create ${userType === 'patient' ? 'Patient' : 'Practitioner'} Account`
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-ayur-primary hover:text-ayur-secondary font-medium transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;