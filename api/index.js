module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;

  // Test endpoint
  if (url.includes('/test')) {
    return res.status(200).json({
      success: true,
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    });
  }

  // Auth endpoints
  if (url.includes('/auth/register') && method === 'POST') {
    const { name, email, password, role } = req.body || {};
    const mockUser = {
      _id: Date.now().toString(),
      name: name || 'User',
      email: email || 'user@example.com',
      role: role || 'patient'
    };
    return res.status(201).json({
      success: true,
      token: 'mock_token_' + Date.now(),
      data: { user: mockUser }
    });
  }

  if (url.includes('/auth/login') && method === 'POST') {
    const mockUser = {
      _id: '123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'patient'
    };
    return res.status(200).json({
      success: true,
      token: 'mock_token_login',
      data: { user: mockUser }
    });
  }

  // Practitioners endpoints
  if (url.includes('/practitioners') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        practitioners: [
          {
            _id: '1',
            name: 'Dr. Priya Sharma',
            specialization: 'Panchakarma',
            consultationFee: 1500,
            stats: { avgRating: 4.8, appointmentCount: 150 }
          }
        ]
      }
    });
  }

  // Therapies endpoints
  if (url.includes('/therapies') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        therapies: [
          { name: 'Abhyanga', price: 2500, description: 'Full body massage', duration: 60 },
          { name: 'Shirodhara', price: 3000, description: 'Oil therapy', duration: 45 },
          { name: 'Panchakarma', price: 5000, description: 'Detox program', duration: 90 }
        ]
      }
    });
  }

  // Bookings endpoints
  if (url.includes('/bookings') && method === 'POST') {
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          _id: Date.now().toString(),
          status: 'pending',
          date: new Date().toISOString()
        }
      }
    });
  }

  if (url.includes('/bookings/my') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        bookings: [
          {
            _id: '1',
            therapy: 'Abhyanga',
            date: new Date().toISOString(),
            time: '10:00 AM',
            status: 'confirmed',
            amount: 2500,
            patient: { name: 'Test Patient', _id: '123' }
          }
        ]
      }
    });
  }

  if (url.includes('/bookings/dashboard-stats') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        stats: {
          todayBookings: 3,
          avgRating: 4.5,
          totalRatings: 25,
          monthlyRevenue: 15000
        }
      }
    });
  }

  // Available slots
  if (url.includes('/available-slots') && method === 'GET') {
    return res.status(200).json({
      success: true,
      data: {
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
      }
    });
  }

  // Default response
  res.status(200).json({
    success: true,
    message: 'AyurSutra API',
    url: url,
    method: method
  });
};