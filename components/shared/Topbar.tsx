import Image from "next/image"
import Link from "next/link"
import { OrganizationSwitcher, SignedIn,SignOutButton } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
const Topbar = () => {
  return (
    <nav className="topbar">
        <Link href="/" className="flex items-center gap-4">
            <Image src="/assets/logo.svg" alt="logo" width={28} height={28}>

            </Image>

            <p className="text-heading3-bold text-light-1 max-xs:hidden">PicThread</p>
        </Link>
        
        <div className="flex items-center gap-1">
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