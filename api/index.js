export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple test endpoint
  if (req.url === '/api/test' || req.url === '/test') {
    return res.status(200).json({
      success: true,
      message: 'API is working correctly',
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    });
  }

  // Default response
  res.status(200).json({
    success: true,
    message: 'AyurSutra API',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  });
}