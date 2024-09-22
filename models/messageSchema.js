import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text:{
        type:String,
        default:""
    },
    imageUrl : {
        type:String,
        default:""
    },
    videoUrl : {
        type:String,
        default:""
    },
    sendBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    seen :{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export const Message = mongoose.model("Message",messageSchema)