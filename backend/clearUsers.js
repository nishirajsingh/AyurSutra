const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

const clearUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursutra');
    console.log('Connected to MongoDB');

    // Clear all users
    const result = await User.deleteMany({});
    console.log(`Deleted ${result.deletedCount} users from database`);
    
    console.log('\n✅ Database cleared successfully!');
    console.log('Users can now register fresh accounts through the signup page.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing users:', error);
    process.exit(1);
  }
};

clearUsers();