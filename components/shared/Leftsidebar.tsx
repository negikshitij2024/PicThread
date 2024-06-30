"use client"

import Link from 'next/link'
import {sidebarLinks} from '../../constants/index.js'
import Image from 'next/image.js'
import { usePathname } from 'next/navigation.js'
import { SignOutButton, SignedIn, useAuth } from '@clerk/nextjs'

const Leftsidebar = () => {
    const pathname=usePathname()
    const {userId}=useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">

        <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((item)=>{
            const isActive= (pathname.includes(item.route) && item.route.length > 1)||pathname===item.route;
            if(item.route ==='/profile') item.route=`/profile/${userId}`
            return (<Link
             href={item.route}
             key={item.label}
             className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
            >
            <Image src={item.imgURL} width={24} height={24} alt={item.label}>
            </Image>
            
            <p className='text-light-1 max-lg:hidden'>{item.label}</p>
            </Link>)    
})}

        </div>

    <div className="mt-10 px-6">
        <SignedIn>
        <SignOutButton redirectUrl='/sign-in'>

            <div className="flex flex-row gap-2 cursor-pointer">
            <Image src="/assets/logout.svg" alt="logout" width={24} height={24} >

            </Image>
            <p className='text-light-1 max-md:hidden'> Logout</p>
            </div>
        </SignOutButton>
        </SignedIn>

    </div>


    </section>
  )
}

export default Leftsidebar