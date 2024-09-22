import mongoose from "mongoose";

const conversation = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    message : [
        {
            type : mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Message"
        }
    ]
},{
    timestamps: true
})

export const Conversation = mongoose.model('Conversaion',conversation)