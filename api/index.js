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
      timestamp: new Date().toISOString(),
      url: url,
      method: method
    });
  }

  // Registration endpoint
  if (url.includes('/auth/register') && method === 'POST') {
    try {
      const { name, email, password, role } = req.body || {};
      
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      // Mock user creation
      const mockUser = {
        _id: Date.now().toString(),
        name,
        email,
        role: role || 'patient',
        createdAt: new Date()
      };

      // Generate simple token
      const token = 'mock_token_' + Date.now();

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
    message: 'AyurSutra API is running',
    url: url,
    method: method,
    timestamp: new Date().toISOString()
  });
};