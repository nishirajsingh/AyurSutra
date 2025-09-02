const User = require('../models/User');
const Therapy = require('../models/Therapy');
const connectDB = require('../config/database');
require('dotenv').config();

const therapiesData = [
  {
    name: 'Abhyanga',
    description: 'Full body oil massage with warm herbal oils',
    icon: '🌿',
    durations: [
      { minutes: 30, price: 80, popular: false },
      { minutes: 60, price: 150, popular: true },
      { minutes: 90, price: 220, popular: false }
    ],
    benefits: ['Improves circulation', 'Reduces stress', 'Nourishes skin']
  },
  {
    name: 'Shirodhara',
    description: 'Continuous pouring of warm oil on forehead',
    icon: '💧',
    durations: [
      { minutes: 45, price: 120, popular: false },
      { minutes: 60, price: 180, popular: true },
      { minutes: 75, price: 240, popular: false }
    ],
    benefits: ['Calms mind', 'Improves sleep', 'Reduces anxiety']
  },
  {
    name: 'Panchakarma',
    description: 'Complete detoxification and rejuvenation program',
    icon: '🔄',
    durations: [
      { minutes: 120, price: 350, popular: false },
      { minutes: 180, price: 500, popular: true },
      { minutes: 240, price: 650, popular: false }
    ],
    benefits: ['Deep detox', 'Rejuvenation', 'Balances doshas']
  },
  {
    name: 'Nasya',
    description: 'Nasal administration of medicated oils',
    icon: '🌸',
    durations: [
      { minutes: 30, price: 60, popular: false },
      { minutes: 45, price: 90, popular: true },
      { minutes: 60, price: 120, popular: false }
    ],
    benefits: ['Clears sinuses', 'Improves breathing', 'Mental clarity']
  },
  {
    name: 'Basti',
    description: 'Medicated enema therapy for colon cleansing',
    icon: '🌱',
    durations: [
      { minutes: 60, price: 140, popular: false },
      { minutes: 90, price: 200, popular: true },
      { minutes: 120, price: 260, popular: false }
    ],
    benefits: ['Colon cleansing', 'Improves digestion', 'Balances Vata']
  }
];

const practitionersData = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43210',
    practitionerDetails: {
      experience: '15 years',
      specialization: 'Panchakarma & Abhyanga',
      rating: 4.9,
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      description: 'Expert in traditional Ayurvedic treatments with focus on detoxification'
    }
  },
  {
    name: 'Dr. Rajesh Patel',
    email: 'rajesh.patel@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43211',
    practitionerDetails: {
      experience: '12 years',
      specialization: 'Shirodhara & Nasya',
      rating: 4.8,
      availability: ['10:00', '11:00', '12:00', '15:00', '16:00'],
      description: 'Specialized in mental wellness and stress relief therapies'
    }
  },
  {
    name: 'Dr. Meera Singh',
    email: 'meera.singh@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43212',
    practitionerDetails: {
      experience: '18 years',
      specialization: 'Basti & Panchakarma',
      rating: 4.9,
      availability: ['09:00', '11:00', '12:00', '14:00', '17:00'],
      description: 'Senior practitioner with expertise in complete detox programs'
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Therapy.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@ayursutra.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43200'
    });

    // Create demo patient
    await User.create({
      name: 'Demo Patient',
      email: 'demo@ayursutra.com',
      password: 'demo123',
      role: 'patient',
      phone: '+91 98765 43201',
      profile: {
        age: 35,
        gender: 'Male',
        address: '123 Health Street, Mumbai, Maharashtra',
        medicalHistory: ['Chronic back pain - 2 years', 'Stress and anxiety'],
        allergies: ['Nuts'],
        medications: ['Ashwagandha 500mg - Morning']
      }
    });

    // Create practitioners
    await User.insertMany(practitionersData);

    // Create therapies
    await Therapy.insertMany(therapiesData);

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;