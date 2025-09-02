const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursutra');
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      // Patients
      {
        name: 'John Doe',
        email: 'patient@ayursutra.com',
        password: 'demo123',
        role: 'patient',
        phone: '+91 98765 43210',
        address: '123 Health Street, Mumbai, Maharashtra',
        age: 35,
        gender: 'male',
        dateOfBirth: new Date('1989-05-15'),
        medicalHistory: [
          { condition: 'Chronic back pain', duration: '2 years', notes: 'Lower back pain due to desk job' },
          { condition: 'Stress and anxiety', duration: '1 year', notes: 'Work-related stress' }
        ],
        allergies: ['Nuts', 'Dairy products'],
        currentMedications: [
          { name: 'Ashwagandha', dosage: '500mg', frequency: 'Morning' },
          { name: 'Triphala', dosage: '250mg', frequency: 'Night' }
        ],
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+91 98765 43211',
          relationship: 'Spouse'
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@email.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91 98765 43212',
        address: '456 Wellness Avenue, Delhi, Delhi',
        age: 28,
        gender: 'female',
        dateOfBirth: new Date('1996-03-20'),
        medicalHistory: [
          { condition: 'Migraine headaches', duration: '5 years', notes: 'Frequent headaches, stress-related' },
          { condition: 'Digestive issues', duration: '2 years', notes: 'Irregular eating habits' }
        ],
        allergies: ['Pollen'],
        currentMedications: [
          { name: 'Brahmi', dosage: '300mg', frequency: 'Morning' }
        ]
      },

      // Practitioners
      {
        name: 'Dr. Priya Sharma',
        email: 'practitioner@ayursutra.com',
        password: 'demo123',
        role: 'practitioner',
        phone: '+91 98765 43213',
        address: 'Ayurveda Clinic, Pune, Maharashtra',
        age: 42,
        gender: 'female',
        specialization: 'Panchakarma & Abhyanga',
        experience: 15,
        qualification: 'BAMS, MD (Ayurveda)',
        licenseNumber: 'AYU12345',
        consultationFee: 1500,
        rating: 4.9,
        totalRatings: 150,
        availability: [
          {
            day: 'monday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isAvailable: true },
              { startTime: '10:00', endTime: '11:00', isAvailable: true },
              { startTime: '14:00', endTime: '15:00', isAvailable: true }
            ]
          },
          {
            day: 'tuesday',
            slots: [
              { startTime: '09:00', endTime: '10:00', isAvailable: true },
              { startTime: '11:00', endTime: '12:00', isAvailable: true }
            ]
          }
        ]
      },
      {
        name: 'Dr. Rajesh Patel',
        email: 'rajesh.patel@ayursutra.com',
        password: 'practitioner123',
        role: 'practitioner',
        phone: '+91 98765 43214',
        address: 'Wellness Center, Bangalore, Karnataka',
        age: 38,
        gender: 'male',
        specialization: 'Shirodhara & Nasya',
        experience: 12,
        qualification: 'BAMS, Panchakarma Specialist',
        licenseNumber: 'AYU67890',
        consultationFee: 1200,
        rating: 4.8,
        totalRatings: 120
      },

      // Admin
      {
        name: 'Admin User',
        email: 'admin@ayursutra.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91 98765 43215',
        address: 'AyurSutra Headquarters, Mumbai, Maharashtra',
        age: 35,
        gender: 'male'
      }
    ];

    // Hash passwords and create users
    for (let userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      userData.password = hashedPassword;
      userData.lastLogin = new Date();
      userData.isActive = true;
    }

    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users successfully`);

    // Display login credentials
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Patient: patient@ayursutra.com / demo123');
    console.log('Practitioner: practitioner@ayursutra.com / demo123');
    console.log('Admin: admin@ayursutra.com / admin123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();