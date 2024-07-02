import { PostThread } from "@/components/forms/PostThread";
import { fetchuser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
const page=async()=>{
    const user=await currentUser()
    if(!user) return null

    const userinfo=await fetchuser(user.id);

    if(!userinfo.onboarded) redirect('/onboarding')

return(
    <>
    <h1 className="head-text mb-4">Create-Thread</h1>
    <PostThread userid={userinfo._id}/>
    </>
)

}

export default page