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
  },
  {
    name: 'Udvartana',
    description: 'Herbal powder massage for weight management',
    icon: '🌾',
    durations: [
      { minutes: 45, price: 100, popular: false },
      { minutes: 60, price: 140, popular: true },
      { minutes: 90, price: 200, popular: false }
    ],
    benefits: ['Weight loss', 'Improves skin texture', 'Reduces cellulite']
  },
  {
    name: 'Kizhi',
    description: 'Herbal poultice massage therapy',
    icon: '🌿',
    durations: [
      { minutes: 45, price: 110, popular: false },
      { minutes: 60, price: 160, popular: true },
      { minutes: 75, price: 210, popular: false }
    ],
    benefits: ['Joint pain relief', 'Muscle relaxation', 'Improves flexibility']
  },
  {
    name: 'Pizhichil',
    description: 'Royal treatment with warm oil pouring and massage',
    icon: '👑',
    durations: [
      { minutes: 60, price: 200, popular: false },
      { minutes: 90, price: 280, popular: true },
      { minutes: 120, price: 360, popular: false }
    ],
    benefits: ['Deep relaxation', 'Nervous system rejuvenation', 'Anti-aging']
  },
  {
    name: 'Akshi Tarpana',
    description: 'Eye treatment with medicated ghee',
    icon: '👁️',
    durations: [
      { minutes: 30, price: 80, popular: false },
      { minutes: 45, price: 120, popular: true },
      { minutes: 60, price: 160, popular: false }
    ],
    benefits: ['Improves vision', 'Reduces eye strain', 'Prevents eye diseases']
  },
  {
    name: 'Karna Purana',
    description: 'Ear treatment with warm medicated oils',
    icon: '👂',
    durations: [
      { minutes: 20, price: 50, popular: false },
      { minutes: 30, price: 70, popular: true },
      { minutes: 45, price: 100, popular: false }
    ],
    benefits: ['Improves hearing', 'Reduces ear pain', 'Prevents infections']
  },
  {
    name: 'Shirobasti',
    description: 'Oil pooling therapy for head and neck',
    icon: '🛁',
    durations: [
      { minutes: 45, price: 150, popular: false },
      { minutes: 60, price: 200, popular: true },
      { minutes: 75, price: 250, popular: false }
    ],
    benefits: ['Treats headaches', 'Improves memory', 'Reduces stress']
  },
  {
    name: 'Marma Therapy',
    description: 'Vital point massage for energy balance',
    icon: '⚡',
    durations: [
      { minutes: 45, price: 120, popular: false },
      { minutes: 60, price: 170, popular: true },
      { minutes: 90, price: 240, popular: false }
    ],
    benefits: ['Energy balance', 'Pain relief', 'Emotional healing']
  }
];

const practitionersData = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43210',
    gender: 'female',
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
    gender: 'male',
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
    gender: 'female',
    practitionerDetails: {
      experience: '18 years',
      specialization: 'Basti & Panchakarma',
      rating: 4.9,
      availability: ['09:00', '11:00', '12:00', '14:00', '17:00'],
      description: 'Senior practitioner with expertise in complete detox programs'
    }
  },
  {
    name: 'Dr. Anita Gupta',
    email: 'anita.gupta@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43213',
    gender: 'female',
    practitionerDetails: {
      experience: '10 years',
      specialization: 'Udvartana & Kizhi',
      rating: 4.7,
      availability: ['09:00', '10:00', '14:00', '15:00', '16:00'],
      description: 'Specialist in therapeutic massages and weight management'
    }
  },
  {
    name: 'Dr. Vikram Joshi',
    email: 'vikram.joshi@ayursutra.com',
    password: 'password123',
    role: 'practitioner',
    phone: '+91 98765 43214',
    gender: 'male',
    practitionerDetails: {
      experience: '20 years',
      specialization: 'Pizhichil & Marma Therapy',
      rating: 4.9,
      availability: ['10:00', '11:00', '12:00', '15:00', '17:00'],
      description: 'Senior expert in royal treatments and energy healing'
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
      phone: '+91 98765 43200',
      gender: 'male'
    });

    // Create demo patients
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

    await User.create({
      name: 'Patient3',
      email: 'patient3@ayursutra.com',
      password: 'patient123',
      role: 'patient',
      phone: '+91 98765 43202',
      profile: {
        age: 28,
        gender: 'Female',
        address: '456 Wellness Avenue, Delhi, India',
        medicalHistory: ['Migraine headaches', 'Insomnia'],
        allergies: ['Dairy'],
        medications: ['Brahmi tablets - Evening']
      }
    });

    // Create practitioners
    await User.insertMany(practitionersData);

    // Create Doctor3 specifically
    await User.create({
      name: 'Doctor3',
      email: 'doctor3@ayursutra.com',
      password: 'doctor123',
      role: 'practitioner',
      phone: '+91 98765 43215',
      gender: 'male',
      practitionerDetails: {
        experience: '8 years',
        specialization: 'All Therapies',
        rating: 4.6,
        availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        description: 'Versatile practitioner skilled in multiple Ayurvedic therapies'
      }
    });

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