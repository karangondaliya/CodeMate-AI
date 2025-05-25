const mongoose = require('mongoose');
const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    }catch(error){
        console.error("MongoDB connection error:", error);
    }
}

module.exports = connectDb;