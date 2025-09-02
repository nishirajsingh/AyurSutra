const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Therapy = require('./models/Therapy');
const Appointment = require('./models/Appointment');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Therapy.deleteMany({});
    await Appointment.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@ayursutra.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9999999999',
      isActive: true
    });

    // Create Practitioners
    const practitioners = await User.create([
      {
        name: 'Dr. Rajesh Sharma',
        email: 'rajesh@ayursutra.com',
        password: 'doctor123',
        role: 'practitioner',
        phone: '+91-9876543210',
        address: 'Ayurveda Center, New Delhi',
        specialization: 'Panchakarma Specialist',
        experience: 15,
        qualification: 'BAMS, MD (Ayurveda)',
        consultationFee: 1500,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        },
        isActive: true
      },
      {
        name: 'Dr. Priya Patel',
        email: 'priya@ayursutra.com',
        password: 'doctor123',
        role: 'practitioner',
        phone: '+91-9876543211',
        address: 'Wellness Center, Mumbai',
        specialization: 'Herbal Medicine & Yoga Therapy',
        experience: 12,
        qualification: 'BAMS, PhD (Ayurveda)',
        consultationFee: 1200,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        },
        isActive: true
      },
      {
        name: 'Dr. Amit Kumar',
        email: 'amit@ayursutra.com',
        password: 'doctor123',
        role: 'practitioner',
        phone: '+91-9876543212',
        address: 'Ayur Clinic, Bangalore',
        specialization: 'Massage Therapy & Detox',
        experience: 8,
        qualification: 'BAMS, Diploma in Panchakarma',
        consultationFee: 1000,
        availability: {
          days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          timeSlots: ['10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        },
        isActive: true
      }
    ]);

    // Create Patients
    const patients = await User.create([
      {
        name: 'Aman Maurya',
        email: 'aman@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91-9123456789',
        address: 'Delhi, India',
        dateOfBirth: new Date('1995-05-15'),
        isActive: true
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91-9123456790',
        address: 'Mumbai, India',
        dateOfBirth: new Date('1988-08-22'),
        isActive: true
      },
      {
        name: 'Rahul Singh',
        email: 'rahul@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91-9123456791',
        address: 'Bangalore, India',
        dateOfBirth: new Date('1992-12-10'),
        isActive: true
      },
      {
        name: 'Kavya Reddy',
        email: 'kavya@example.com',
        password: 'patient123',
        role: 'patient',
        phone: '+91-9123456792',
        address: 'Hyderabad, India',
        dateOfBirth: new Date('1990-03-18'),
        isActive: true
      }
    ]);

    // Create Therapies
    const therapies = await Therapy.create([
      {
        name: 'Abhyanga (Full Body Massage)',
        description: 'Traditional Ayurvedic full body massage with warm herbal oils to improve circulation and reduce stress.',
        duration: 60,
        price: 2500,
        category: 'massage',
        benefits: ['Improves circulation', 'Reduces stress', 'Nourishes skin', 'Enhances flexibility'],
        contraindications: ['Fever', 'Acute illness', 'Skin infections'],
        preparationInstructions: 'Avoid heavy meals 2 hours before treatment. Wear comfortable clothing.',
        aftercareInstructions: 'Rest for 30 minutes after treatment. Drink warm water. Avoid cold foods.',
        popularity: 95,
        isActive: true
      },
      {
        name: 'Shirodhara',
        description: 'Continuous pouring of warm oil on the forehead to calm the mind and nervous system.',
        duration: 45,
        price: 3500,
        category: 'panchakarma',
        benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system', 'Enhances mental clarity'],
        contraindications: ['Head injuries', 'Severe depression', 'Pregnancy (first trimester)'],
        preparationInstructions: 'Avoid alcohol 24 hours before. Come with clean hair.',
        aftercareInstructions: 'Keep head covered for 2 hours. Avoid exposure to wind and cold.',
        popularity: 88,
        isActive: true
      },
      {
        name: 'Panchakarma Detox Program',
        description: 'Complete 7-day detoxification program including multiple therapies and dietary guidance.',
        duration: 420, // 7 days
        price: 25000,
        category: 'panchakarma',
        benefits: ['Complete detoxification', 'Improves immunity', 'Balances doshas', 'Rejuvenates body'],
        contraindications: ['Pregnancy', 'Severe heart conditions', 'Active infections'],
        preparationInstructions: 'Follow pre-detox diet for 3 days. Avoid processed foods and alcohol.',
        aftercareInstructions: 'Follow post-detox diet for 1 week. Gradual return to normal activities.',
        popularity: 75,
        isActive: true
      },
      {
        name: 'Ayurvedic Consultation',
        description: 'Comprehensive health assessment and personalized treatment plan by qualified Ayurvedic doctor.',
        duration: 60,
        price: 1500,
        category: 'consultation',
        benefits: ['Personalized health assessment', 'Dosha analysis', 'Treatment planning', 'Lifestyle guidance'],
        contraindications: [],
        preparationInstructions: 'Bring any previous medical reports. Come on empty stomach if possible.',
        aftercareInstructions: 'Follow prescribed diet and lifestyle recommendations.',
        popularity: 92,
        isActive: true
      },
      {
        name: 'Kizhi (Herbal Poultice Massage)',
        description: 'Therapeutic massage using heated herbal poultices to reduce inflammation and pain.',
        duration: 45,
        price: 2000,
        category: 'herbal-treatment',
        benefits: ['Reduces inflammation', 'Relieves joint pain', 'Improves mobility', 'Strengthens muscles'],
        contraindications: ['Open wounds', 'Severe skin conditions', 'High fever'],
        preparationInstructions: 'Inform about any allergies. Wear minimal clothing.',
        aftercareInstructions: 'Rest for 1 hour. Apply prescribed herbal oils if given.',
        popularity: 70,
        isActive: true
      },
      {
        name: 'Yoga Therapy Session',
        description: 'Personalized yoga practice designed according to your constitution and health needs.',
        duration: 75,
        price: 1200,
        category: 'yoga-therapy',
        benefits: ['Improves flexibility', 'Reduces stress', 'Enhances strength', 'Balances mind-body'],
        contraindications: ['Recent surgeries', 'Severe joint problems', 'Acute back pain'],
        preparationInstructions: 'Wear comfortable clothes. Avoid heavy meals 2 hours before.',
        aftercareInstructions: 'Practice recommended asanas daily. Maintain regular breathing exercises.',
        popularity: 85,
        isActive: true
      }
    ]);

    // Create some sample appointments
    const appointments = [];
    const today = new Date();
    
    // Past appointments
    for (let i = 1; i <= 10; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() - i);
      
      appointments.push({
        patient: patients[i % patients.length]._id,
        practitioner: practitioners[i % practitioners.length]._id,
        therapy: therapies[i % therapies.length]._id,
        date: appointmentDate,
        timeSlot: ['09:00', '10:00', '11:00', '14:00', '15:00'][i % 5],
        status: 'completed',
        totalAmount: therapies[i % therapies.length].price,
        paymentStatus: 'paid',
        paymentMethod: 'online',
        completedAt: appointmentDate,
        notes: 'Treatment completed successfully',
        practitionerNotes: 'Patient responded well to treatment'
      });
    }
    
    // Future appointments
    for (let i = 1; i <= 5; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);
      
      appointments.push({
        patient: patients[i % patients.length]._id,
        practitioner: practitioners[i % practitioners.length]._id,
        therapy: therapies[i % therapies.length]._id,
        date: appointmentDate,
        timeSlot: ['09:00', '10:00', '11:00', '14:00', '15:00'][i % 5],
        status: 'scheduled',
        totalAmount: therapies[i % therapies.length].price,
        paymentStatus: 'pending',
        notes: 'Looking forward to the treatment'
      });
    }
    
    const createdAppointments = await Appointment.create(appointments);

    // Create feedback for completed appointments
    const feedbacks = [];
    const completedAppointments = createdAppointments.filter(apt => apt.status === 'completed');
    
    for (let i = 0; i < Math.min(completedAppointments.length, 8); i++) {
      const appointment = completedAppointments[i];
      feedbacks.push({
        appointment: appointment._id,
        patient: appointment.patient,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        symptoms: ['stress', 'fatigue', 'joint pain', 'insomnia'][Math.floor(Math.random() * 4)],
        improvement: ['much_better', 'better'][Math.floor(Math.random() * 2)],
        comments: [
          'Excellent treatment! Feeling much better.',
          'Very professional and effective therapy.',
          'Great experience, will definitely come back.',
          'Highly recommend this treatment.',
          'Amazing results, thank you!'
        ][Math.floor(Math.random() * 5)]
      });
    }
    
    await Feedback.create(feedbacks);

    // Create sample notifications
    const notifications = [];
    patients.forEach(patient => {
      notifications.push(
        {
          user: patient._id,
          title: 'Welcome to AyurSutra!',
          message: 'Thank you for joining AyurSutra. Book your first consultation today.',
          type: 'general',
          priority: 'medium'
        },
        {
          user: patient._id,
          title: 'Appointment Reminder',
          message: 'You have an upcoming appointment tomorrow at 10:00 AM.',
          type: 'reminder',
          priority: 'high'
        }
      );
    });
    
    practitioners.forEach(practitioner => {
      notifications.push(
        {
          user: practitioner._id,
          title: 'New Patient Registration',
          message: 'A new patient has registered and is looking for consultation.',
          type: 'general',
          priority: 'medium'
        },
        {
          user: practitioner._id,
          title: 'Today\'s Schedule',
          message: 'You have 3 appointments scheduled for today.',
          type: 'appointment',
          priority: 'high'
        }
      );
    });
    
    await Notification.create(notifications);

    console.log('Database seeded successfully!');
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Admin: admin@ayursutra.com / admin123');
    console.log('\nPractitioners:');
    console.log('Dr. Rajesh Sharma: rajesh@ayursutra.com / doctor123');
    console.log('Dr. Priya Patel: priya@ayursutra.com / doctor123');
    console.log('Dr. Amit Kumar: amit@ayursutra.com / doctor123');
    console.log('\nPatients:');
    console.log('Aman Maurya: aman@example.com / patient123');
    console.log('Sneha Gupta: sneha@example.com / patient123');
    console.log('Rahul Singh: rahul@example.com / patient123');
    console.log('Kavya Reddy: kavya@example.com / patient123');
    console.log('\n=========================');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();