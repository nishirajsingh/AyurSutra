import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRICING_DATA } from '../constants';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';

const Pricing = () => {
  const navigate = useNavigate();
  // Removed unused variables

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayur-light via-white to-ayur-accent/20">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-ayur-primary mb-4">
            Transparent Pricing for Authentic Ayurvedic Therapies
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Choose from our range of traditional Panchakarma treatments with flexible duration options
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {Object.entries(PRICING_DATA).map(([key, therapy], index) => (
            <div 
              key={key}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{therapy.icon}</div>
                <h3 className="text-2xl font-bold text-ayur-primary mb-2">{therapy.name}</h3>
                <p className="text-gray-600">{therapy.description}</p>
              </div>

              {/* Duration Options */}
              <div className="space-y-4 mb-6">
                {Object.entries(therapy.durations).map(([duration, details]) => (
                  <div 
                    key={duration}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      details.popular 
                        ? 'border-ayur-primary bg-ayur-light shadow-md' 
                        : 'border-gray-200 hover:border-ayur-accent'
                    }`}
                    onClick={() => console.log('Selected:', key, duration)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-ayur-primary">{duration} minutes</span>
                        {details.popular && (
                          <span className="ml-2 px-2 py-1 bg-ayur-primary text-white text-xs rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-ayur-primary">₹{details.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h4 className="font-semibold text-ayur-primary mb-3">Benefits:</h4>
                <ul className="space-y-2">
                  {therapy.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="text-ayur-secondary mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-ayur-primary hover:bg-ayur-secondary text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Package Deals */}
        <div className="mt-16 animate-fade-in-delay">
          <h3 className="text-3xl font-bold text-center text-ayur-primary mb-8">Package Deals</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-ayur-primary to-ayur-secondary rounded-3xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Wellness Package</h4>
              <p className="mb-4">3 Sessions of Abhyanga + 2 Sessions of Shirodhara</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm opacity-80 line-through">₹22,500</span>
                  <span className="text-3xl font-bold ml-2">₹19,500</span>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-ayur-primary px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Book Package
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-ayur-secondary to-ayur-accent rounded-3xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Detox Package</h4>
              <p className="mb-4">1 Panchakarma + 2 Basti + 1 Nasya</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm opacity-80 line-through">₹28,000</span>
                  <span className="text-3xl font-bold ml-2">₹24,000</span>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-ayur-primary px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300"
                >
                  Book Package
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 animate-fade-in-delay">
          <h3 className="text-3xl font-bold text-center text-ayur-primary mb-8">Frequently Asked Questions</h3>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "What's included in the session price?",
                a: "All sessions include consultation, therapy treatment, and post-treatment guidance."
              },
              {
                q: "Can I cancel or reschedule?",
                a: "Free cancellation up to 24 hours before your appointment."
              },
              {
                q: "Do you offer group discounts?",
                a: "Yes, 10% discount for bookings of 3 or more people."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                <h4 className="font-semibold text-ayur-primary mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <GlobalFooter />
    </div>
  );
};

export default Pricing;