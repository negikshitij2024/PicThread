"use server"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connecttoDb } from "../mongoose"
import mongoose from "mongoose"
import Community from "../models/community.model"

interface threadProps {
    author: string,
    text: string,
    communityId: string | null
    path: string
}
export async function createThread({ text, author, communityId, path }: threadProps) {
    try {
        connecttoDb()
        const communityIdObject=await Community.findOne({id:communityId},{
            _id:1
        })
        
        const newthread = await Thread.create({
            text,
            author,
            community: communityIdObject
        })
        if (communityIdObject){
            await Community.findOneAndUpdate({id:communityId},{
                $push:{threads:newthread._id}
            })
        }
        await User.findOneAndUpdate({ _id: author }, {
            $push: { threads: newthread._id }
        })
        if(communityIdObject){
            await Community.findByIdAndUpdate(communityIdObject,{
                $push:{threads:newthread._id}
            })
        }
        revalidatePath(path)
    } catch (error) {
        throw new Error(`could not create thread due to ${error}`)
    }

}


export async function fetchPosts(pagenumber = 1, pagesize = 10) {
    try {
        connecttoDb()
        const skipamt = (pagenumber - 1) * pagesize

        const query = Thread.find({ parentId: { $in: [null, undefined] } }).sort({ createdAt: "desc" }).skip(skipamt).limit(pagesize)
            .populate(
                {
                    path: "author",
                    model: User
                }
            )
            .populate(
                {
                    path: "children",
                    populate: {
                        path: "author",
                        model: User,
                        select: "_id name image parentid"
                    }
                }
            )
            .populate({path:"community",model:Community})

        const totalpostcount = await Thread.countDocuments({ parentid: { $in: [null, undefined] } })

        const posts = await query.exec()
        const isNext = totalpostcount > skipamt + posts.length

        return { posts, isNext }

    } catch (error: any) {
        throw new Error(`the threads could not be fetched due to ${error.message}`)
    }
}

export async function fetchThreadById(id: string) {
    try {
        connecttoDb()
        const thread = await Thread.findById(id)
            .populate({ path: 'author', model: User, select: "_id id name image" })
            .populate({ path: 'children', populate: [{ path: 'author', model: User, select: '_id id name parentId image' }, { path: 'children', model: Thread, populate: { path: 'author', model: User, select: "_id id name parentId image" } }] })
            .populate({path:"community",model:Community,select:"image name id _id"}).exec();
        return thread;
    }
    catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(threadId:string,commentText:string,userId:string,path:string){
try{
    connecttoDb()
    const orgthread=await Thread.findById(threadId)
    
    if (!orgthread){
        throw new Error("Thread not Found")
    }
    const comment=new Thread({
        text:commentText,
        author:userId,
        parentId:threadId,
        
    })

    const savedCommentThread=await comment.save()

   orgthread.children.push(savedCommentThread._id)
   await orgthread.save()
    await User.findByIdAndUpdate(userId,{
        $push:{threads:savedCommentThread._id}
    })

   revalidatePath(path)
}
catch(error:any)
{
    throw new Error(`Error occured while adding the comment to Thread ${error.message}`)
}
}

export async function getParentThread(id:string){
    try {
        connecttoDb()
        const newid=new mongoose.Types.ObjectId(id)
        const parentThread= await Thread.findById(newid).populate({path:"author",model:User,select:"id image name"})
       
        return parentThread
    } catch (error:any) {
        throw new Error(`could not get the parent thread ${error.message}`)
    }
}

const findAllChildren=async(id:string):Promise<any[]>=>{
const childThreads=await Thread.find({parentId:id}).populate("author community")
const descendantsThreads=[]

for(const child of childThreads){
    const descendents=await findAllChildren(child._id)
    descendantsThreads.push(child,...descendents)
}

return descendantsThreads;


}

export async function deleteThread(threadId:string,pathname:string){
    try{
        const mainThread=await Thread.findById(threadId).populate("author community")
            console.log(mainThread)
        //find the descendent threads (comments and their comments)
            const descThreads=await findAllChildren(threadId)

            const descids=[threadId,...descThreads.map((thread:any)=>thread._id)]
        //find the userid and communityid of all the descendent threads
            const userids=new Set([
                ...descThreads.map((thread:any)=>thread.author?._id?.toString()),
                mainThread.author?._id?.toString()
            ].filter((id)=>id!==undefined))

            const commIds=new Set([
                
                ...descThreads.map((thread:any)=>thread.community?._id?.toString()),
                mainThread.community?._id?.toString()

            ].filter((id)=>id!=undefined))
        //update the user and communities by removing the respective descendent Thread
        await Thread.deleteMany({_id:{$in:descids}})

        await User.updateMany({_id:{$in:Array.from(userids)}},{$pull:{threads:{$in:descids}}})

        await Community.updateMany({_id:{$in:Array.from(commIds)}},{$pull:{threads:{$in:{descids}}}})
    
    revalidatePath(pathname)
    }
    catch(error:any){
        throw new Error(`could not delte the thread ${error.message}`)
    }
}