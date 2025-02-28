import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchuser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communityTabs } from "@/constants"
import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { fetchCommunityDetails } from "@/lib/actions/community.actions"
import UserCard from "@/components/cards/UserCard"
import Thread from "@/lib/models/thread.model"

const Page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser()
    if (!user) return null

    const communityDetails=await fetchCommunityDetails(params.id)
    const noofposts=await Thread.countDocuments({community:communityDetails._id,parent:{$in:[null,undefined]}})
    console.log(communityDetails)
    return (
        <section>
            <ProfileHeader accountId={communityDetails.id} authUserId={user.id} name={communityDetails.name} username={communityDetails?.username} imgUrl={communityDetails?.image} bio={communityDetails.bio} type="Community" />

            <div className="mt-9">

                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab justify-around">
                        {communityTabs.map((tab)=>(
                            <TabsTrigger key={tab.label} value={tab.value} className="hover:opacity-75">
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    height={24}
                                    width={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>

                                {tab.label == 'Threads' &&(
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                        {noofposts}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                        
                    </TabsList>

                    
                        <>
                    <TabsContent  value="threads" className='w-full text-light-1'>
                       
                       
                       
                        <ThreadsTab currentUserId={user.id} accountId={communityDetails._id} accountType='Community'/>
                        
                    </TabsContent>
                    <TabsContent  value="members" className='w-full text-light-1'>
                       
                      {communityDetails.members.filter((member:any)=>member._id!==user.id).map((member:any)=>( 
                       <div className="mt-3 bg-dark-2">
                    <UserCard id={member.id} name={member.name} username={member.username} imgUrl={member.image} personType="User"/>
                    </div>))}
                    </TabsContent>

                    </>
                   
                    </Tabs>


            </div>
        </section>
    )
}

export default Page