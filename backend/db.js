const mongoose = require('mongoose');

// Replace <username>, <password>, and <your-cluster-url> with your actual credentials and cluster URL
const uri = 'mongodb+srv://tanmaymeshram883:gXwanRiLPdQbRTem@cluster0.x0qoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 20000, // 20 seconds for connection attempts
      serverSelectionTimeoutMS: 20000, // 20 seconds for server selection
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
