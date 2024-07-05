import Image from "next/image"
import Link from "next/link"
import { OrganizationSwitcher, SignedIn,SignOutButton, useAuth, UserButton, useUser } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { currentUser } from "@clerk/nextjs/server"
import { fetchuser } from "@/lib/actions/user.actions"
import Document from "next/document"
const Topbar = async() => {
    const user=await currentUser()

    const userinfo=user?(await fetchuser(user.id)):(null)

   

  return (
    <nav className="topbar">
        <div  className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
            

            <p className="text-heading3-bold text-light-1 max-xs:hidden">PicThread</p>
        </Link>

        
        </div>
        <div className="flex items-center gap-1">

        {userinfo &&<Link href={`/profile/${userinfo.id}`} className="cursor-pointer"><Image src={userinfo.image} alt="userimage" width={20} height={18} className="rounded-full"/></Link>}
            
            <div className="block md:hidden">

                <SignedIn>
                    <SignOutButton>
                        <div className="flex cursor-pointer">
                            <Image src="/assets/logout.svg" width={28} height={28} alt="logout">
                            </Image>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
           
            <OrganizationSwitcher
             appearance={
                {
                    baseTheme:dark,
                    elements:{
                        organizationSwitcherTrigger:
                        "py-2 px-4"
                    }
                }
             }
            />
        </div>
    </nav>
  )
}

export default Topbar