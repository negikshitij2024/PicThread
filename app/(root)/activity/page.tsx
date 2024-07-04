import { fetchuser, getActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {timeAgo} from "../../../lib/utils"
import ReplyCard from "@/components/cards/ReplyCard"
const page =async() => {
  const user=await currentUser()
  if(!user) return null

  const userinfo=await fetchuser(user.id)

  if(!userinfo || !userinfo.onboarded) redirect('/onboarding')

    const result=await getActivity(userinfo._id)
    console.log(result[0].createdAt.getFullYear())
    return (
      <>
        <h1 className="head-text">Activity</h1>

        <section className="mt-10 flex flex-col gap-5">
        {result.length>0?(<>
        {result.map((activity)=>( <Link key={activity.id}href={`/thread/${activity.parentId}`}>
          <ReplyCard type="activity" authorImage={activity.author.image} authorName={activity.author.name} creationTime={activity.createdAt} message={activity.text}/>
          
         </Link>))}
        
        </>):(<p className="!text-base-regular text-light-3">No Activity</p>)}

        </section>
      </>
    )
  }
  
  export default page