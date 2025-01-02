import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return mongoose.connection.asPromise();
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  try {
    return mongoose.connect(uri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

export default connectMongoDB;
