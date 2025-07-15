
//import mongoose from 'mongoose';

//const MONGODB_URI = process.env.MONGODB_URI;

//if (!MONGODB_URI) {
//  throw new Error('⚠️ Please define the MONGODB_URI in .env.local');
//}

//let cached = global.mongoose;

//if (!cached) {
//  cached = global.mongoose = { conn: null, promise: null };
//}

//async function connectDB() {
//  if (cached.conn) return cached.conn;

//  if (!cached.promise) {
//    cached.promise = mongoose.connect(MONGODB_URI, {
//      dbName: 'college_erp',
//     useNewUrlParser: true,
//      useUnifiedTopology: true,
//    }).then((mongoose) => {
//      return mongoose;
//    });
//  }

//  cached.conn = await cached.promise;
//  return cached.conn;
//}

// export default connectDB;





import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

export default connectDB;
