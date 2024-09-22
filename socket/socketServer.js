import express from "express"
import http from "http"
import { Server } from "socket.io"
import dotenv  from 'dotenv';
import { getUserByToken } from "../helpers/getUserByToken.js";
import { Conversation } from "../models/conversationSchema.js"
import { Message } from "../models/messageSchema.js"
import { giveChats } from "../helpers/giveChats.js"

dotenv.config()

export const app = express()

export const server = http.createServer(app)

const allowedOrigins = [process.env.FRONT_END_URL,"http://localhost:5173"]

const io = new Server(server,{
    cors: {
        origin:function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
              callback(null, true);  // السماح بالوصول
            } else {
              callback(new Error('Not allowed by CORS'));  // رفض الوصول
            }
        },
        methods:["GET","POST","PUT","DELETE"],
        credentials : true
    }
})

const onlineUsers = new Set()

io.on("connection",async(socket) => {
    console.log(`User connected: ${socket.id}`)
    const token = socket.handshake.auth.token
    // console.log(token)
    const user = await getUserByToken(token)
    // console.log(user.id)
    socket.join(user.id)
    onlineUsers.add(user.id)

    io.emit("onlineUsers",Array.from(onlineUsers))

    socket.on("give-me-messags",async(receviedId)=>{
        const getConversation = await Conversation.findOne({
            "$or" : [
                { sender : user.id, receiver : receviedId },
                { sender : receviedId, receiver :  user.id}
            ]
        }).populate('message').sort({ updatedAt : -1 })
        socket.emit("take-messages",getConversation?.message)
    })

    socket.on("give-chats",async()=>{
        const chats = await giveChats(user.id)
        // console.log(chats)
        socket.emit("all-chats",chats)
    })

    socket.on("new-message",async(data)=>{
        let conversation = await Conversation.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        })
        if(!conversation){
            const newConver = new Conversation({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await newConver.save()
        }
        const newMessage = new Message({
            text:data.text,
            imageUrl:data.imageUrl,
            videoUrl: data.videoUrl,
            sendBy:data.sender
        })
        const msg = await newMessage.save()

        const updateCon = await Conversation.updateOne({_id:conversation._id},{
            message : [...conversation.message,msg._id]
        })

        const getConversation = await Conversation.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        io.to(data.sender).emit("allMessage",getConversation.message)
        io.to(data.receiver).emit("allMessage",getConversation.message)

        const chats = await giveChats(data.sender)
        const chatsReceiver = await giveChats(data.receiver)
        // console.log(chats)
        io.to(data.sender).emit("all-chats",chats)
        io.to(data.receiver).emit("all-chats",chatsReceiver)
    })

    socket.on("seen",async(receivedId)=>{
        const getConversation = await Conversation.findOne({
            "$or" : [
                { sender : user.id, receiver : receivedId },
                { sender : receivedId, receiver :  user.id}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        if(getConversation){
            const msgs = getConversation.message
            await Message.updateMany({_id:msgs.map(msg=>msg._id),sendBy:receivedId},{seen:true},{new:true})
            // io.to(receivedId).emit("take-messages",getConversation.message)
        }
        
        const chats = await giveChats(user.id)
        // console.log(chats)
        io.to(user.id).emit("all-chats",chats)
        io.to(receivedId).emit("all-chats",chats)
    })

    // Typing 

    socket.on("typing",(receivedId)=>{
        io.to(receivedId).emit("typing")
    })
    
    socket.on("stopTyping",(receivedId)=>{
        io.to(receivedId).emit("stopTyping")
    })

    socket.on("disconnect",() => {
        console.log("User disconnected",user.id)
        onlineUsers.delete(user.id)
        io.emit("onlineUsers",Array.from(onlineUsers))
    })
})