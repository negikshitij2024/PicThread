import { fetchuser, getActivity } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import {timeAgo} from "../../../lib/utils"
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
          <article className="activity-card">
           <Image src={activity.author.image} alt="profile_profile" height={20} width={20} className="rounded-full"/>  
           <p className="!text-small-regular text-light-1">
            <span className='mr-1 text-primary-500'>{activity.author.name}</span>
            replied to your thread
            <span className="text-gray-600 ml-4">{timeAgo(activity.createdAt)}</span>
            <></>
            </p>        
          </article>
         </Link>))}
        
        </>):(<p className="!text-base-regular text-light-3">No Activity</p>)}

        </section>
      </>
    )
  }
  
  export default page