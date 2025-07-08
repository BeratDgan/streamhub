import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim:true
    },

    description:{
        type: String,
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',                         
        required: true
    },

    startedAt:{
        type:Date,    
        required:true
    },
    
    isLive:{
        type:Boolean,
        default:false
    },
    streamKey: {
    type: String,
    required: true,
    unique: true,
    trim: true
    }


});

export default mongoose.model('Stream', streamSchema);