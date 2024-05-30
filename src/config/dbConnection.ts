import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(Bun.env.DB_CONNECTION);
    if (connect) {
      console.log(
        `Connected to database with host:${connect.connection.host} and name:${connect.connection.name}`
      );
    }
  } catch (error: any) {
    console.log(`Error connecting to database: ${error.message}`);
  }
};
