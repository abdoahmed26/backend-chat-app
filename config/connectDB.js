import mongoose from "mongoose";

export const connectDB =  ()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>console.log("connect to mongodb"))
    .catch(()=>console.log("failed to connect to mongodb"))
}