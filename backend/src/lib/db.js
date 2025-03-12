import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB connected"+conn.connection.host)
            
    }catch(error){
        console.log("MongoDB connected error",error)    }
}