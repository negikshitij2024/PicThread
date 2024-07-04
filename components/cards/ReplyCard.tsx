import { timeAgo } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
interface props{
    type:string,authorImage:string,authorName:string,creationTime:Date,message:string
}
const ReplyCard = ({type,authorImage,authorName,creationTime,message}:props) => {
  return (
    <article className="activity-card">
           <Image src={authorImage} alt="profile_profile" height={20} width={20} className="rounded-full"/>  
           <p className="!text-small-regular text-light-1">
            <span className='mr-1 text-primary-500'>{authorName}</span>
           {type=="activity"?("replied to your thread"):(`${message}`)}
            <span className="text-gray-600 ml-4">{timeAgo(creationTime)}</span>
            <></>
            </p>        
    </article>
  )
}

export default ReplyCard