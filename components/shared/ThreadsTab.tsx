import { fetchUserPosts } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface props{
    currentUserId:string,accountId:string,accountType:string
}

const ThreadsTab = async({currentUserId,accountId,accountType}:props) => {

    let result=accountType==="User"? (await fetchUserPosts(accountId)):(await fetchCommunityPosts(accountId))
    // console.log(`these are ${result.name}'s Threads`)
    // console.log(result.threads)
    // if(!result) redirect('/')
    console.log(`community posts are - ${result.threads}`)
    let resultset=new Set(result.threads)
    let uniqueresults=Array.from(resultset)
  return (
    <section className="mt-9 flex flex-col gap-10">
        {uniqueresults.length>0? (uniqueresults.map((post:any)=>(
            <ThreadCard key={post._id} author={accountType=='User'?({name:result.name,image:result.image,id:result.id}):({name:post.author.name,image:post.author.image,id:post.author.id})} currentUserid={currentUserId} comments={post.children} parentid={post.parentId} content={post.text} community={accountType=="Community"?({name:result.name,id:result.id,image:result.image}):(post.community)} createdAt={post.createdAt} id={post._id} isComment={post.parentid==undefined || post.parentId==null?(false):(true)}/>
        ))):(<p className="no-result">No Threads</p>)}

    </section>
  )
}

export default ThreadsTab