import AccountProfile from "@/components/forms/AccountProfile"
import { fetchuser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const Page=async()=>{
   const user=await currentUser()

   if(!user) return null;

     const userinfo=await fetchuser(user.id)
  
     if (!userinfo?.onboarded) redirect("/onboarding");
   const userobj={
    username:user.username ?? "",
    name:userinfo? userinfo.name:user.firstName ?? "",
    bio:userinfo? userinfo.bio:"",
    image:userinfo? userinfo.image:user.imageUrl,
    objectId:userinfo?._id,
    id:user.id
   }

    return (
        <>
        <h1 className="head-text">Edit Profile</h1>
        <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

        <section className="mt-12">
            <AccountProfile user={userobj} btnTitle="Continue"/>
        </section>
        </>
  )
}

export default Page