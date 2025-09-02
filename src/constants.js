export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00'
];

export const LOGO_CONFIG = {
  icon: '🌿',
  name: 'AyurSutra',
  tagline: 'Ancient Wisdom, Modern Care'
};

export const NAVIGATION_ITEMS = {
  PATIENT: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'book', label: 'Book Session', icon: '📅' },
    { id: 'schedule', label: 'My Schedule', icon: '📋' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'feedback', label: 'Feedback', icon: '💬' }
  ],
  PRACTITIONER: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'insights', label: 'Insights', icon: '📊' }
  ],
  ADMIN: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ]
};

export const HEADER_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' }
];

export const PRICING_DATA = {
  Abhyanga: {
    name: 'Abhyanga',
    description: 'Full body oil massage with warm herbal oils',
    icon: '🌿',
    durations: {
      30: { price: 80, popular: false },
      60: { price: 150, popular: true },
      90: { price: 220, popular: false }
    },
    benefits: ['Improves circulation', 'Reduces stress', 'Nourishes skin']
  },
  Shirodhara: {
    name: 'Shirodhara',
    description: 'Continuous pouring of warm oil on forehead',
    icon: '💧',
    durations: {
      45: { price: 120, popular: false },
      60: { price: 180, popular: true },
      75: { price: 240, popular: false }
    },
    benefits: ['Calms mind', 'Improves sleep', 'Reduces anxiety']
  },
  Panchakarma: {
    name: 'Panchakarma',
    description: 'Complete detoxification and rejuvenation program',
    icon: '🔄',
    durations: {
      120: { price: 350, popular: false },
      180: { price: 500, popular: true },
      240: { price: 650, popular: false }
    },
    benefits: ['Deep detox', 'Rejuvenation', 'Balances doshas']
  },
  Nasya: {
    name: 'Nasya',
    description: 'Nasal administration of medicated oils',
    icon: '🌸',
    durations: {
      30: { price: 60, popular: false },
      45: { price: 90, popular: true },
      60: { price: 120, popular: false }
    },
    benefits: ['Clears sinuses', 'Improves breathing', 'Mental clarity']
  },
  Basti: {
    name: 'Basti',
    description: 'Medicated enema therapy for colon cleansing',
    icon: '🌱',
    durations: {
      60: { price: 140, popular: false },
      90: { price: 200, popular: true },
      120: { price: 260, popular: false }
    },
    benefits: ['Colon cleansing', 'Improves digestion', 'Balances Vata']
  }
};

export const THERAPY_TYPES = Object.keys(PRICING_DATA);

export const PRACTITIONERS_DATA = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    experience: '15 years',
    specialization: 'Panchakarma & Abhyanga',
    rating: 4.9,
    photo: '👩‍⚕️',
    description: 'Expert in traditional Ayurvedic treatments with focus on detoxification',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
  },
  {
    id: 2,
    name: 'Dr. Rajesh Patel',
    experience: '12 years',
    specialization: 'Shirodhara & Nasya',
    rating: 4.8,
    photo: '👨‍⚕️',
    description: 'Specialized in mental wellness and stress relief therapies',
    availability: ['10:00', '11:00', '12:00', '15:00', '16:00']
  },
  {
    id: 3,
    name: 'Dr. Meera Singh',
    experience: '18 years',
    specialization: 'Basti & Panchakarma',
    rating: 4.9,
    photo: '👩‍⚕️',
    description: 'Senior practitioner with expertise in complete detox programs',
    availability: ['09:00', '11:00', '12:00', '14:00', '17:00']
  }
];

export const ADMIN_STATS = {
  overview: [
    { label: 'Total Revenue', value: '₹24.5L', change: '+12%', icon: '💰', color: 'from-green-500 to-green-600' },
    { label: 'Active Patients', value: '1,250', change: '+8%', icon: '👥', color: 'from-blue-500 to-blue-600' },
    { label: 'Practitioners', value: '45', change: '+3%', icon: '👨‍⚕️', color: 'from-purple-500 to-purple-600' },
    { label: 'Sessions Today', value: '127', change: '+15%', icon: '📅', color: 'from-orange-500 to-orange-600' }
  ],
  systemHealth: [
    { metric: 'Server Uptime', value: '99.9%', status: 'excellent' },
    { metric: 'Response Time', value: '120ms', status: 'good' },
    { metric: 'Error Rate', value: '0.1%', status: 'excellent' },
    { metric: 'Database Load', value: '65%', status: 'good' }
  ],
  recentTransactions: [
    { id: 'TXN001', patient: 'John Doe', practitioner: 'Dr. Priya Sharma', amount: 4500, therapy: 'Abhyanga', date: '2024-01-15', time: '10:30 AM', status: 'completed', paymentMethod: 'UPI', transactionId: 'UPI2024011501' },
    { id: 'TXN002', patient: 'Jane Smith', practitioner: 'Dr. Rajesh Patel', amount: 5500, therapy: 'Shirodhara', date: '2024-01-15', time: '02:15 PM', status: 'completed', paymentMethod: 'Card', transactionId: 'CARD2024011502' },
    { id: 'TXN003', patient: 'Mike Johnson', practitioner: 'Dr. Meera Singh', amount: 18000, therapy: 'Panchakarma', date: '2024-01-14', time: '11:00 AM', status: 'pending', paymentMethod: 'UPI', transactionId: 'UPI2024011403' },
    { id: 'TXN004', patient: 'Sarah Wilson', practitioner: 'Dr. Priya Sharma', amount: 2800, therapy: 'Nasya', date: '2024-01-15', time: '04:45 PM', status: 'failed', paymentMethod: 'Card', transactionId: 'CARD2024011504' },
    { id: 'TXN005', patient: 'David Brown', practitioner: 'Dr. Rajesh Patel', amount: 6000, therapy: 'Basti', date: '2024-01-15', time: '09:20 AM', status: 'completed', paymentMethod: 'Cash', transactionId: 'CASH2024011505' },
    { id: 'TXN006', patient: 'Lisa Garcia', practitioner: 'Dr. Meera Singh', amount: 4500, therapy: 'Abhyanga', date: '2024-01-15', time: '03:30 PM', status: 'processing', paymentMethod: 'UPI', transactionId: 'UPI2024011506' }
  ],
  systemLogs: [
    { id: 1, type: 'error', message: 'Payment gateway timeout', timestamp: '2024-01-15 10:30', severity: 'high' },
    { id: 2, type: 'warning', message: 'High server load detected', timestamp: '2024-01-15 09:15', severity: 'medium' },
    { id: 3, type: 'info', message: 'Database backup completed', timestamp: '2024-01-15 08:00', severity: 'low' }
  ]
};

export const DUMMY_DATA = {
  upcomingSessions: [
    { id: 1, therapy: 'Abhyanga', date: '2024-01-15', time: '10:00', practitioner: 'Dr. Sharma' },
    { id: 2, therapy: 'Shirodhara', date: '2024-01-17', time: '14:00', practitioner: 'Dr. Patel' }
  ],
  notifications: [
    { id: 1, message: 'Session reminder: Abhyanga tomorrow at 10:00 AM', type: 'reminder' },
    { id: 2, message: 'Please complete your feedback for last session', type: 'feedback' }
  ],
  patients: [
    {
      id: 1,
      name: 'John Doe',
      status: 'active',
      nextSession: '2024-01-15',
      therapy: 'Abhyanga',
      photo: '👨',
      age: 35,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'john.doe@email.com',
      address: '123 Health Street, Mumbai, Maharashtra',
      medicalHistory: [
        'Chronic back pain - 2 years',
        'Stress and anxiety',
        'Sleep disorders'
      ],
      currentTreatment: {
        plan: 'Panchakarma Detox Program',
        startDate: '2024-01-01',
        duration: '21 days',
        progress: '65%',
        sessionsCompleted: 8,
        totalSessions: 12
      },
      treatmentHistory: [
        { date: '2024-01-14', therapy: 'Abhyanga', duration: '60 min', notes: 'Good response, reduced tension' },
        { date: '2024-01-12', therapy: 'Shirodhara', duration: '45 min', notes: 'Improved sleep quality' },
        { date: '2024-01-10', therapy: 'Nasya', duration: '30 min', notes: 'Sinus congestion cleared' }
      ],
      vitals: {
        bloodPressure: '120/80',
        pulse: '72 bpm',
        weight: '75 kg',
        lastUpdated: '2024-01-14'
      },
      allergies: ['Nuts', 'Dairy products'],
      medications: ['Ashwagandha 500mg - Morning', 'Triphala 250mg - Night']
    },
    {
      id: 2,
      name: 'Jane Smith',
      status: 'upcoming',
      nextSession: '2024-01-16',
      therapy: 'Shirodhara',
      photo: '👩',
      age: 28,
      gender: 'Female',
      phone: '+91 98765 43211',
      email: 'jane.smith@email.com',
      address: '456 Wellness Avenue, Delhi, Delhi',
      medicalHistory: [
        'Migraine headaches - 5 years',
        'Digestive issues',
        'Hormonal imbalance'
      ],
      currentTreatment: {
        plan: 'Stress Relief Program',
        startDate: '2024-01-05',
        duration: '14 days',
        progress: '40%',
        sessionsCompleted: 4,
        totalSessions: 10
      },
      treatmentHistory: [
        { date: '2024-01-13', therapy: 'Shirodhara', duration: '60 min', notes: 'Significant stress reduction' },
        { date: '2024-01-11', therapy: 'Abhyanga', duration: '45 min', notes: 'Muscle tension improved' }
      ],
      vitals: {
        bloodPressure: '110/70',
        pulse: '68 bpm',
        weight: '58 kg',
        lastUpdated: '2024-01-13'
      },
      allergies: ['Pollen'],
      medications: ['Brahmi 300mg - Morning', 'Shankhpushpi 200mg - Evening']
    }
  ]
};