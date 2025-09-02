import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_CONFIG } from '../../constants';

const GlobalFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-ayur-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-xl text-ayur-primary">{LOGO_CONFIG.icon}</span>
              </div>
              <div>
                <h4 className="text-xl font-bold">{LOGO_CONFIG.name}</h4>
                <p className="text-sm text-ayur-light">{LOGO_CONFIG.tagline}</p>
              </div>
            </div>
            <p className="text-ayur-light text-sm">
              Bridging ancient Ayurvedic wisdom with modern technology for holistic wellness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => navigate('/')} className="block text-ayur-light hover:text-white transition-colors duration-300 text-sm">Home</button>
              <button onClick={() => navigate('/about')} className="block text-ayur-light hover:text-white transition-colors duration-300 text-sm">About</button>
              <button onClick={() => navigate('/pricing')} className="block text-ayur-light hover:text-white transition-colors duration-300 text-sm">Pricing</button>
              <button onClick={() => navigate('/contact')} className="block text-ayur-light hover:text-white transition-colors duration-300 text-sm">Contact</button>
              <button onClick={() => navigate('/login')} className="block text-ayur-light hover:text-white transition-colors duration-300 text-sm">Login</button>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-ayur-light">
              <p>📧 info@ayursutra.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 123 Wellness Street, Ayur City</p>
              <p>🕒 Mon-Sat: 9AM-6PM</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="space-y-2">
              <div className="text-ayur-light cursor-pointer hover:text-white transition-colors duration-300 text-sm">📱 Facebook</div>
              <div className="text-ayur-light cursor-pointer hover:text-white transition-colors duration-300 text-sm">🐦 Twitter</div>
              <div className="text-ayur-light cursor-pointer hover:text-white transition-colors duration-300 text-sm">💼 LinkedIn</div>
              <div className="text-ayur-light cursor-pointer hover:text-white transition-colors duration-300 text-sm">📷 Instagram</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ayur-secondary mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-ayur-light text-sm">
              &copy; 2024 {LOGO_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button className="text-ayur-light hover:text-white transition-colors duration-300">Privacy Policy</button>
              <button className="text-ayur-light hover:text-white transition-colors duration-300">Terms of Service</button>
              <button className="text-ayur-light hover:text-white transition-colors duration-300">Support</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;