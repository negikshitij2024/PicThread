import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"

interface props{
    currentUserId:string,accountId:string,accountType:string
}

const ThreadsTab = async({currentUserId,accountId,accountType}:props) => {

    let result=await fetchUserPosts(accountId)
    console.log(`these are ${result.name}'s Threads`)
    console.log(result.threads)
    if(!result) redirect('/')
  return (
    <section className="mt-9 flex flex-col gap-10">
        {result.threads.map((post:any)=>(
            <ThreadCard key={post._id} author={accountType=='User'?({name:result.name,image:result.image,id:result.id}):({name:post.author.name,image:post.author.image,id:post.author.id})} currentUserid={currentUserId} comments={post.children} parentid={post.parentId} content={post.text} community={accountType=="Community"?({name:result.name,id:result.id,image:result.image}):(post.community)} createdAt={post.createdAt} id={post._id} isComment={post.parentid==undefined || post.parentId==null?(false):(true)}/>
        ))}

    </section>
  )
}

export default ThreadsTab