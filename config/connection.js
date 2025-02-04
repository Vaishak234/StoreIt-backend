import mongoose from "mongoose";
import dotEnv from "dotenv";

dotEnv.config()
 
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not defined in the environment variables');
}   

async function connectDb() {
    try { 
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);
    }         
}

export default connectDb;                    