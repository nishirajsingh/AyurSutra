import React, { useState } from 'react';
import GlobalHeader from '../components/common/GlobalHeader';
import GlobalFooter from '../components/common/GlobalFooter';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      title: 'Visit Our Center',
      details: ['123 Wellness Street', 'Ayur City, AC 12345', 'India'],
      icon: '📍'
    },
    {
      title: 'Call Us',
      details: ['+91 98765 43210', '+91 98765 43211', 'Mon-Sat: 9AM-6PM'],
      icon: '📞'
    },
    {
      title: 'Email Us',
      details: ['info@ayursutra.com', 'support@ayursutra.com', 'appointments@ayursutra.com'],
      icon: '📧'
    }
  ];

  const faqs = [
    {
      question: 'How do I book my first appointment?',
      answer: 'Simply click on "Book Now" and create your account. Our system will guide you through selecting a practitioner and available time slots.'
    },
    {
      question: 'What should I expect during my first consultation?',
      answer: 'Your first session includes a comprehensive health assessment, dosha analysis, and personalized treatment plan discussion.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'We accept most major insurance plans. Please contact us with your insurance details for verification.'
    },
    {
      question: 'Can I reschedule my appointment?',
      answer: 'Yes, you can reschedule up to 24 hours before your appointment through your patient dashboard or by calling us.'
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
              Get in Touch
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Have questions about our services? Need help with booking? 
              We're here to support your wellness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-ayur-primary mb-8">Contact Information</h2>
              
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-ayur-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl text-white">{info.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ayur-primary mb-2">{info.title}</h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h3 className="text-lg font-semibold text-ayur-primary mb-4">Find Us</h3>
                <div className="h-48 bg-gradient-to-br from-ayur-light to-ayur-accent/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-ayur-primary font-medium">Interactive Map</p>
                    <p className="text-sm text-gray-600">Location: Wellness Street, Ayur City</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-ayur-primary mb-6">Send us a Message</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <p className="text-green-700 font-medium">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="appointment">Book Appointment</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-ayur-primary focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ayur-primary hover:bg-ayur-secondary text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-ayur-primary mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-ayur-primary mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};

export default Contact;