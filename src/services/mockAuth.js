// Mock authentication service with real user data
const MOCK_USERS = [
  // Patients
  {
    id: 1,
    email: 'john.doe@email.com',
    password: 'patient123',
    role: 'patient',
    name: 'John Doe',
    phone: '+91 98765 43210',
    age: 35,
    gender: 'Male'
  },
  {
    id: 2,
    email: 'jane.smith@email.com',
    password: 'patient123',
    role: 'patient',
    name: 'Jane Smith',
    phone: '+91 98765 43211',
    age: 28,
    gender: 'Female'
  },
  {
    id: 3,
    email: 'patient@ayursutra.com',
    password: 'demo123',
    role: 'patient',
    name: 'Demo Patient',
    phone: '+91 98765 43212',
    age: 30,
    gender: 'Male'
  },
  
  // Practitioners
  {
    id: 4,
    email: 'priya.sharma@ayursutra.com',
    password: 'practitioner123',
    role: 'practitioner',
    name: 'Dr. Priya Sharma',
    phone: '+91 98765 43213',
    experience: '15 years',
    specialization: 'Panchakarma & Abhyanga',
    rating: 4.9
  },
  {
    id: 5,
    email: 'rajesh.patel@ayursutra.com',
    password: 'practitioner123',
    role: 'practitioner',
    name: 'Dr. Rajesh Patel',
    phone: '+91 98765 43214',
    experience: '12 years',
    specialization: 'Shirodhara & Nasya',
    rating: 4.8
  },
  {
    id: 6,
    email: 'practitioner@ayursutra.com',
    password: 'demo123',
    role: 'practitioner',
    name: 'Dr. Demo Practitioner',
    phone: '+91 98765 43215',
    experience: '10 years',
    specialization: 'General Ayurveda',
    rating: 4.7
  },
  
  // Admin
  {
    id: 7,
    email: 'admin@ayursutra.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    phone: '+91 98765 43216'
  },
  {
    id: 8,
    email: 'demo@ayursutra.com',
    password: 'demo123',
    role: 'admin',
    name: 'Demo Admin',
    phone: '+91 98765 43217'
  }
];

// Mock authentication functions
export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Generate mock token
  const token = `mock_token_${user.id}_${Date.now()}`;
  
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      ...(user.role === 'patient' && { age: user.age, gender: user.gender }),
      ...(user.role === 'practitioner' && { 
        experience: user.experience, 
        specialization: user.specialization, 
        rating: user.rating 
      })
    }
  };
};

export const mockRegister = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingUser = MOCK_USERS.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }
  
  // Create new user
  const newUser = {
    id: MOCK_USERS.length + 1,
    ...userData,
    password: userData.password
  };
  
  MOCK_USERS.push(newUser);
  
  // Generate mock token
  const token = `mock_token_${newUser.id}_${Date.now()}`;
  
  return {
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
      phone: newUser.phone,
      ...(newUser.role === 'patient' && { age: newUser.age, gender: newUser.gender }),
      ...(newUser.role === 'practitioner' && { 
        experience: newUser.experience, 
        specialization: newUser.specialization, 
        rating: newUser.rating || 4.5
      })
    }
  };
};

export const validateToken = (token) => {
  return token && token.startsWith('mock_token_');
};

export const getUserFromToken = (token) => {
  if (!validateToken(token)) return null;
  
  const userId = parseInt(token.split('_')[2]);
  const user = MOCK_USERS.find(u => u.id === userId);
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    phone: user.phone,
    ...(user.role === 'patient' && { age: user.age, gender: user.gender }),
    ...(user.role === 'practitioner' && { 
      experience: user.experience, 
      specialization: user.specialization, 
      rating: user.rating 
    })
  };
};

// Export mock users for reference
export const getMockUsers = () => MOCK_USERS;