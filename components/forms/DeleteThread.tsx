"use client"

import { deleteThread } from '@/lib/actions/thread.actions'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
interface props{
    currentUserid:string,authorId:string,parentid:string |null,isComment:boolean,threadId:string
}
const DeleteThread = ({currentUserid,authorId,parentid,isComment,threadId}:props) => {
    const router=useRouter()
    const pathname=usePathname()
    if(currentUserid!==authorId || pathname==="/")return null
  return (
    <Image
        src="/assets/delete.svg"
        alt="delete"
        width={18}
        height={18}
        className="cursor-pointer object-contain"
        onClick={()=>{
            deleteThread(JSON.parse(threadId),pathname)
           .then(()=>{
            if(!isComment || !parentid){
                router.push('/')
            }})
        }}

        />
  )
}



export default DeleteThread