module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url, method } = req;

    // Register endpoint
    if (url.includes('/register') && method === 'POST') {
      const { name, email, password, role } = req.body || {};
      const mockUser = {
        _id: Date.now().toString(),
        name: name || 'User',
        email: email || 'user@example.com',
        role: role || 'patient',
        createdAt: new Date()
      };
      return res.status(201).json({
        success: true,
        token: 'mock_token_' + Date.now(),
        data: { user: mockUser }
      });
    }

    // Login endpoint
    if (url.includes('/login') && method === 'POST') {
      const { email, password } = req.body || {};
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: email || 'test@example.com',
        role: 'patient'
      };
      return res.status(200).json({
        success: true,
        token: 'mock_token_login',
        data: { user: mockUser }
      });
    }

    // Get me endpoint
    if (url.includes('/me') && method === 'GET') {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'patient'
      };
      return res.status(200).json({
        success: true,
        data: { user: mockUser }
      });
    }

    res.status(404).json({ success: false, message: 'Auth endpoint not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};