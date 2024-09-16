import mongoose from "mongoose";

export default async function connectDB() {
  const URI = process.env.DB_URI;
  const DB_NAME = process.env.DB_NAME;

  try {
    const connection = await mongoose.connect(URI, { dbName: DB_NAME });
    console.log("DB connected", connection.connections[0].name);

  } catch (error) {
    console.log("Error in connect to DB", error?.message);
    throw error;
  }
}
