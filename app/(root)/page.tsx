// "use client"
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server";
const home=async()=>{
  const user=await currentUser()
  const result=await fetchPosts(1,30);
  return (
    <main>
    <h1 className="head-text text-left">Home</h1>
    <section className="mt-9 flex flex-col gap-10">
      {result.posts.length==0 ?(<p className="no-result">No Threads Found</p>):
          (result.posts.map((post)=>(
            <ThreadCard key={post._id} author={post.author} currentUserid={user?.id || ""} comments={post.children} parentid={post.parentid} content={post.text} community={post.community} createdAt={post.createdAt} id={post._id} isComment={post.parentid?(true):(false)}/>
          )))}
    </section>
    </main>
  )
}

export default home