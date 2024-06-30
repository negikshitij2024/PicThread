import UserCard from "@/components/cards/UserCard"
import Pagination from "@/components/shared/Pagination"
import Searchbar from "@/components/shared/Searchbar"
import { fetchAllUsers, fetchuser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const page =async({searchParams}:{searchParams:{[key:string]:string | undefined}}) => {
    const user=await currentUser()
    if(!user) return null
    const userinfo=await fetchuser(user.id)

    if(!userinfo) redirect("/onboarding")
    const result=await fetchAllUsers({userId:user.id,searchString:searchParams.q,pagenumber:searchParams?.page? + searchParams.page:1,pagesize:25})
  return (
    <section>
        <h1 className="head-text mb-10">Search</h1>
        <Searchbar routeType='search'/>

        <div className="mt-14 flex flex-col gap-9">
            {result.users.length==0 ?(
                <p className="no-result">No users</p>
            ):(
                <>
                {result.users.map((user)=>(
                    <UserCard id={user.id} name={user.name} username={user.username} imgUrl={user.image} personType="User"/>
                ))}
                </>
            )}

        </div>

            <Pagination pageNumber={searchParams?.page? + searchParams.page:1} isNext={result.isNext} path="search"/>
    </section>
  )
}

export default page