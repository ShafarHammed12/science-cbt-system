const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit();
    }

    const admin = new User({
      fullName: 'Administrator',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
