import mongoose from 'mongoose';

async function dbconnect() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database');
  } catch (error) {
    console.error(' Database connection error:', error);
    
  }
}

export default dbconnect;
