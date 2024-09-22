import { Conversation } from "../models/conversationSchema.js"

export const giveChats = async(userId)=>{
    const getConversations = await Conversation.find({
        $or : [
            { sender : userId },
            { receiver : userId}
        ]
    }).populate('sender receiver message').sort({ updatedAt : -1 })
    if(getConversations.length > 0){
        const chats = getConversations.map((item)=>{
            let sum=0;
            item.message.map((ele)=> {
                if(ele.sendBy.toString() !== userId){
                    return ele.seen ? null : sum+=1
                }
                else {
                    return sum
                }
            })
            return ({
                sender:{
                    _id:item.sender._id,
                    name:item.sender.name,
                    email:item.sender.email,
                    profile_pic:item.sender.profile_pic,
                },
                receiver:{
                    _id:item.receiver._id,
                    name:item.receiver.name,
                    email:item.receiver.email,
                    profile_pic:item.receiver.profile_pic,
                },
                seen:sum,
                lastMsg:item.message[item.message.length - 1]
            })
        })
        return chats;
    }
    else {
        return []
    }
}