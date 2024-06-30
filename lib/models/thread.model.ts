import mongoose from "mongoose";

const threadSchema=new mongoose.Schema({
    text:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    parentId:{type:String},
    createdAt:{type:Date,default:Date.now},
    children:[{type:mongoose.Schema.Types.ObjectId,ref:"Thread"}],
    community:{type:mongoose.Schema.Types.ObjectId,ref:"Community"},
})


const Thread = mongoose.models.Thread || mongoose.model('Thread',threadSchema)

export default Thread