import mongoose from "mongoose";

// creating coonnection in the database
export const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connection ${connection.connection.host}`);
  } catch (err) {
    console.log(`Error connecting to mongoDB: ${err.message}`);
  }
};
