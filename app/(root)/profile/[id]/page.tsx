import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchuser, getReplies } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"
import ReplyCard from "@/components/cards/ReplyCard"

const Page = async ({ params }: { params: { id: string } }) => {
    const user = await currentUser()
    if (!user) return null

    const userInfo = await fetchuser(params.id)

    if (!userInfo || !userInfo.onboarded) redirect('/onboarding')

    const replies = await getReplies(userInfo._id)

    return (
        <section>
            <ProfileHeader accountId={userInfo.id} authUserId={user.id} name={userInfo.name} username={userInfo?.username} imgUrl={userInfo?.image} bio={userInfo.bio} />

            <div className="mt-9">

                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab justify-around">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="hover:opacity-75">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    height={24}
                                    width={24}
                                    className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>


                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {tab.label == "Threads" ? (userInfo?.threads?.length) : (replies.length)}
                                </p>

                            </TabsTrigger>
                        ))}

                    </TabsList>


                    <>
                        <TabsContent value="threads" className='w-full text-light-1'>



                            <ThreadsTab currentUserId={user.id} accountId={userInfo._id} accountType='User' />

                        </TabsContent>

                        <TabsContent value="replies" className='w-full text-light-1'>


                            {replies && (<>
                                {replies?.map((reply: any) => (<ReplyCard key={reply._id} type="replies" authorImage={reply.author.image} authorName={reply.author.username} creationTime={reply.createdAt} message={reply.text} />
                                ))}
                            </>)}


                        </TabsContent>
                    </>



                </Tabs>


            </div>
        </section>
    )
}

export default Page