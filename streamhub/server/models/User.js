import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim:true
    
    },
    password:{
        type: String,
        required: true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    isStreamer:{
        type:Boolean,
        required:true
    },
    streamKey:{
        type:String,
        unique:true,
        trim:true,
    },
    isLive:{
        type:Boolean,
        default:false
    }

});

export default mongoose.model('User', userSchema);