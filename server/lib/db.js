import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected")
    );

    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    
    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });
  } catch (error) {
    console.log(error);
  }
};
