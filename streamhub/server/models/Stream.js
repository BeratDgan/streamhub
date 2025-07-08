import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim:true
    },

    description:{
        type: String,
    },

    user:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    startedAt:{
        type:Date,    
        required:true
    },
    
    isLive:{
        type:Boolean,
        default:false
    }


});

export default mongoose.model('Stream', userSchema);