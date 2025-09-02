import React from 'react';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';

const About = () => {
  const teamMembers = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Ayurvedic Practitioner',
      experience: '15+ years',
      photo: '👩‍⚕️',
      description: 'Expert in Panchakarma and traditional healing methods'
    },
    {
      name: 'Dr. Rajesh Patel',
      role: 'Senior Consultant',
      experience: '12+ years',
      photo: '👨‍⚕️',
      description: 'Specialist in stress management and mental wellness'
    },
    {
      name: 'Dr. Meera Singh',
      role: 'Detox Specialist',
      experience: '18+ years',
      photo: '👩‍⚕️',
      description: 'Pioneer in modern Ayurvedic detoxification programs'
    }
  ];

  const values = [
    {
      title: 'Authentic Ayurveda',
      description: 'Traditional practices backed by ancient wisdom',
      icon: '🌿'
    },
    {
      title: 'Modern Technology',
      description: 'Digital solutions for seamless healthcare management',
      icon: '💻'
    },
    {
      title: 'Personalized Care',
      description: 'Tailored treatments for individual wellness journeys',
      icon: '❤️'
    },
    {
      title: 'Holistic Healing',
      description: 'Complete mind, body, and spirit wellness approach',
      icon: '🧘‍♀️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ayur-light/30 via-white to-ayur-accent/10">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-ayur-primary mb-6">
              About AyurSutra
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Bridging 5000 years of Ayurvedic wisdom with cutting-edge technology to create 
              a seamless wellness experience for modern practitioners and patients.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-ayur-primary rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl text-white">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-ayur-primary mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To make authentic Ayurvedic healthcare accessible, efficient, and personalized 
                through innovative technology while preserving the essence of traditional healing practices.
              </p>
            </div>
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-ayur-secondary rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl text-white">🌟</span>
              </div>
              <h2 className="text-3xl font-bold text-ayur-primary mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become the leading platform that seamlessly integrates ancient Ayurvedic wisdom 
                with modern healthcare management, creating a global community of wellness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-ayur-primary mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center animate-fade-in-delay">
                <div className="w-20 h-20 bg-gradient-to-r from-ayur-primary to-ayur-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">{value.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-ayur-primary mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-ayur-primary mb-12">Meet Our Expert Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="w-24 h-24 bg-ayur-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">{member.photo}</span>
                </div>
                <h3 className="text-xl font-bold text-ayur-primary mb-2">{member.name}</h3>
                <p className="text-ayur-secondary font-medium mb-1">{member.role}</p>
                <p className="text-sm text-gray-600 mb-3">{member.experience} Experience</p>
                <p className="text-gray-700">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-ayur-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-ayur-light">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-ayur-light">Expert Practitioners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-ayur-light">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9⭐</div>
              <div className="text-ayur-light">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};

export default About;