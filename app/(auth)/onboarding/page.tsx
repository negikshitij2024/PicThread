import AccountProfile from "@/components/forms/AccountProfile"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/dist/server/api-utils";

const Page=async()=>{
   const user=await currentUser()

   if(!user) return null;

    // const userinfo=await fetchUser(user.id)
  
    // if (userinfo?.onboarded) redirect("/");
   const userobj={
    username:user.username ?? "",
    name:user.firstName ?? "",
    bio:"",
    image:user.imageUrl,
    objectId:"",
    id:user.id
   }

    return (
    <main className="flex flex-col justify start mx-auto max-w-3xl px-10 py-20">
        <h1 className="head-text">Onboarding</h1>
        <p className="mt-3 text-base-regular text-light-2">Complete your profile now to use threads</p>

        <section className="mt-9 bg-dark-2 p-10">
            <AccountProfile user={userobj} btnTitle="Continue"/>
        </section>
    </main>
  )
}

export default Page