const mongoose = require('mongoose');
const User = require('./models/User');
const Therapy = require('./models/Therapy');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await Therapy.deleteMany({});
    
    // Create sample practitioners
    const practitioners = [
      {
        name: 'Dr. Ayurveda Sharma',
        email: 'doctor@ayursutra.com',
        password: 'password123',
        role: 'practitioner',
        phone: '+91-9876543210'
      },
      {
        name: 'Dr. Priya Patel',
        email: 'priya@ayursutra.com',
        password: 'password123',
        role: 'practitioner',
        phone: '+91-9876543212'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh@ayursutra.com',
        password: 'password123',
        role: 'practitioner',
        phone: '+91-9876543213'
      }
    ];
    
    for (const practData of practitioners) {
      const practitioner = new User(practData);
      await practitioner.save();
    }
    
    // Create sample patient
    const patient = new User({
      name: 'Rahul Patel',
      email: 'patient@example.com',
      password: 'password123',
      role: 'patient',
      phone: '+91-9876543211',
      dateOfBirth: new Date('1990-05-15')
    });
    await patient.save();
    
    // Create therapies
    const therapies = [
      {
        name: 'Abhyanga',
        description: 'Full body oil massage with warm herbal oils',
        duration: 60,
        price: 2500,
        category: 'massage'
      },
      {
        name: 'Panchakarma Detox',
        description: 'Complete detoxification therapy',
        duration: 120,
        price: 8000,
        category: 'panchakarma'
      },
      {
        name: 'Ayurvedic Consultation',
        description: 'Initial consultation and diagnosis',
        duration: 45,
        price: 1500,
        category: 'consultation'
      },
      {
        name: 'Shirodhara',
        description: 'Continuous oil pouring on forehead',
        duration: 45,
        price: 3500,
        category: 'panchakarma'
      }
    ];
    
    await Therapy.insertMany(therapies);
    
    console.log('Sample data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();