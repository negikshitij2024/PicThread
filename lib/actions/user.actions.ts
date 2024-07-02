"use server"

import { connecttoDb } from "../mongoose"
import User from "../models/user.model"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
interface userprops{
    id:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string
}

export async function updateUser({id,name,username,bio,image,path}:userprops):Promise<void>{
connecttoDb();
try{
 await User.findOneAndUpdate({id:id},{
    username:username.toLowerCase(),
    name,
    image,
    bio,
    onboarded:true
 },{upsert:true});


 if(path =='/profile/edit'){
    revalidatePath(path)
 }


}catch(error:any){
    throw new Error(`Failed to create/update user: ${error.message}`)
}

}


export async function fetchuser(userid:string){
try {
    connecttoDb()

    return await User.findOne({id:userid})


} catch (error:any) {
    throw new Error(`could not fetch the user because ${error.message}`)
}
}

export async function fetchUserPosts(userId:string){
    try {
        connecttoDb()
        const userPosts=await User.findById(userId)
        .populate({
            path:'threads',
            model:Thread,
            populate:[{
                path:"community",
                model:Community,
                select:"name id image _id"
            },{
                path:"children",
                model:Thread,
                populate:{
                    path:"author",
                    model:User,
                    select:'name image id'
                }}]
        })

        return userPosts
    } catch (error:any) {
        throw new Error(`Could not fetch User Posts ${error.message}`)
    }
}

export async function fetchAllUsers({userId,searchString="",pagenumber=1,pagesize=20,sortBy="desc"}:{userId:string,searchString?:string,pagenumber:number,pagesize:number,sortBy?:SortOrder}){
    try{   
        connecttoDb()

        const skipamt=(pagenumber-1)*pagesize
        
        const regex=new RegExp(searchString,'i')
        const query:FilterQuery<typeof User>={id:{$ne:userId}}

        if(searchString.trim() !==""){
            query.$or=[{username:{$regex:regex}},{name:{$regex:regex}}]
        }

        const sortOptions={createdAt:sortBy}

        const users=await User.find(query).sort(sortOptions).skip(skipamt).limit(pagesize)

        const totalusers=await User.countDocuments(query)

        const isNext=totalusers>users.length+skipamt

        return {users,isNext}


    }
    catch(error:any){
        throw new Error(`Could not fetch all Users ${error.message}`)
    }
}


export async function getActivity(userId:string){
    try {
        connecttoDb()
        
        const userThreads=await Thread.find({author:userId});

        const childrenThreads=userThreads.reduce((acc,userThread)=>{
            return acc.concat(userThread.children)
        },[])

        const activity=await Thread.find({id:{$in:childrenThreads},author:{$ne:userId}}).populate({path:"author",model:User,select:"_id name image"})
        return activity
    } catch (error:any) {
        throw new Error(`the activity of the user could not be fetched ${error.message}`)
    }
}