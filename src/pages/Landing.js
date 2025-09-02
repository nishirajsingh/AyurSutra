import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Automated Scheduling',
      description: 'Smart appointment booking with conflict resolution',
      icon: '🤖'
    },
    {
      title: 'Smart Notifications',
      description: 'Timely reminders and therapy updates',
      icon: '🔔'
    },
    {
      title: 'Real-time Tracking',
      description: 'Monitor therapy progress and outcomes',
      icon: '📊'
    },
    {
      title: 'Progress Visualization',
      description: 'Visual insights into healing journey',
      icon: '📈'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-b from-ayur-light to-white">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-ayur-primary mb-6">
            Panchakarma Patient Management & Therapy Scheduling
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            AyurSutra brings the timeless wisdom of Ayurveda into the digital era with automated 
            Panchakarma scheduling, smart notifications, real-time therapy tracking, and 
            patient-centered progress visualization.
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary text-lg px-8 py-4 animate-bounce-gentle"
            >
              Book a Therapy
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="btn-secondary text-lg px-8 py-4"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center text-ayur-primary mb-12">
          Why Choose AyurSutra?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-ayur-primary mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-ayur-primary mb-12">
            How AyurSutra Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Your Therapy',
                description: 'Browse our range of authentic Ayurvedic treatments',
                icon: '🎯'
              },
              {
                step: '2',
                title: 'Book Your Session',
                description: 'Select your preferred date, time, and practitioner',
                icon: '📅'
              },
              {
                step: '3',
                title: 'Experience Healing',
                description: 'Enjoy personalized treatment and track your progress',
                icon: '🌟'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-ayur-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">{item.step}</span>
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold text-ayur-primary mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-ayur-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: '500+', label: 'Happy Patients' },
              { number: '50+', label: 'Expert Practitioners' },
              { number: '5000+', label: 'Sessions Completed' },
              { number: '4.9', label: 'Average Rating' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-ayur-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ayur-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-ayur-primary mb-12">
            What Our Users Say
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Priya Sharma',
                role: 'Ayurvedic Practitioner',
                text: 'AyurSutra has transformed how I manage my practice. The automated scheduling saves hours every week.',
                rating: 5
              },
              {
                name: 'Rajesh Kumar',
                role: 'Patient',
                text: 'The progress tracking helped me stay motivated throughout my Panchakarma treatment.',
                rating: 5
              },
              {
                name: 'Sarah Johnson',
                role: 'Wellness Enthusiast',
                text: 'Amazing platform! The booking system is so intuitive and the practitioners are excellent.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="w-16 h-16 bg-ayur-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-ayur-primary font-bold text-xl">{testimonial.name.charAt(0)}</span>
                </div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-ayur-primary">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-ayur-primary mb-4">
            Ready to Begin Your Healing Journey?
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of satisfied patients who have experienced the power of authentic Ayurveda
          </p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary text-lg px-8 py-4"
            >
              Book Your First Session
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="btn-secondary text-lg px-8 py-4"
            >
              View All Pricing
            </button>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};

export default Landing;