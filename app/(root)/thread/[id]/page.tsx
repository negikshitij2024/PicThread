import ThreadCard from "@/components/cards/ThreadCard"
import Comment from "@/components/forms/Comment"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchuser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const Page=async({params}:{params:{id:string}})=>{
    const user=await currentUser()
    if(!user) return null
    const userinfo=await fetchuser(user?.id)

    if(!userinfo || !userinfo.onboarding) redirect('/onboarding')
        const post = await fetchThreadById(params.id)
    const isComment=(!post.parentId)?(false):(true)
    
    console.log(`is Comment ${isComment}`)
return(
<section className="relative">
<div>
<ThreadCard key={post._id} author={post.author} currentUserid={user?.id || ""} comments={post.children} parentid={post.parentId} content={post.text} community={post.community} createdAt={post.createdAt} id={post._id} isComment={post.parentid?(true):(false)}/>

<div className="mt-7">
 <Comment threadId={post.id} userId={userinfo._id} userImage={userinfo.image}/>   
 </div>
</div>

<div className="mt-10">
{post.children.map((child:any)=>(
    <ThreadCard
    key={child._id} author={child.author} currentUserid={user?.id || ""} comments={child.children} parentid={child.parentId} content={child.text} community={child.community} createdAt={child.createdAt} id={child._id} isComment={child.parentId?(true):(false)}
    />
))}
</div>

</section>
)
}

export default Page