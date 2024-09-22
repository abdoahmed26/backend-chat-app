import mongoose from "mongoose";

const codeSchema = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    codeExpired : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    }
})

export const Code = mongoose.model("Code",codeSchema)