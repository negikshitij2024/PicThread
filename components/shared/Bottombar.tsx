"use client"

import { sidebarLinks } from "@/constants"
import { useAuth } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Bottombar = () => {
  const pathname=usePathname()
  const {userId}=useAuth()
  return (
    <section className='bottombar'>
      <div className="bottombar_container">
        {sidebarLinks.map((link)=>{
          const isActive= (pathname.includes(link.route) && link.route.length>1)|| pathname==link.route
          if(link.route=="/profile")
            {
              link.route=`/profile/${userId}`
            }
          return(
            <Link key={link.route} href={link.route}>
            <Image src={link.imgURL} alt={link.label} width={16} height={16} className='object-contain'/>
            <p className='text-subtle-medium text-light-1 max-sm:hidden'>{link.label.split(/\s+/)[0]}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Bottombar