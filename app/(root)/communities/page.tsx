import CommunityCard from "@/components/cards/CommunityCard"
import Pagination from "@/components/shared/Pagination"
import Searchbar from "@/components/shared/Searchbar"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchuser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const page =async({searchParams}:{searchParams:{[key:string]:string | undefined}}) => {
  const user=await currentUser()
  
  if(!user) return null

  const userInfo=await fetchuser(user.id)
  
  if(!userInfo || !userInfo.onboarded) redirect("/onboarding");


  const result=await fetchCommunities({
    searchString:searchParams.q,
    pageNumber:searchParams?.page? +searchParams.page:1,
    pageSize:25,
  })
  return (
      <>
       <h1 className="head-text">Communities</h1>

       <div className="mt-5">
        <Searchbar routeType='communities'/>
       </div>
       <section>
        {result.communities.length===0?(
          <p className="no-result">No result</p>
        )
        :( <div className="mt-3">
          {result.communities.map((community:any)=>(
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))}
          
          </div>)
          
        }
       </section>

       <Pagination path='communities' isNext={result.isNext} pageNumber={searchParams?.page? +searchParams.page:1}/>
      </>
    )
  }
  
  export default page