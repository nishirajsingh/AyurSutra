const jwt = require('jsonwebtoken');

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
  if (url === '/api/test' || url === '/test') {
    return res.status(200).json({
      success: true,
      message: 'API is working correctly',
      timestamp: new Date().toISOString()
    });
  }

  // Registration endpoint
  if (url === '/api/auth/register' && method === 'POST') {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Mock user creation (replace with actual database logic later)
      const mockUser = {
        _id: Date.now().toString(),
        name,
        email,
        role: role || 'patient',
        createdAt: new Date()
      };

      // Generate JWT token
      const token = jwt.sign(
        { id: mockUser._id }, 
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        success: true,
        token,
        data: {
          user: mockUser
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Default response
  res.status(200).json({
    success: true,
    message: 'AyurSutra API',
    availableEndpoints: ['/api/test', '/api/auth/register']
  });
};