import Image from "next/image"
import Link from "next/link"

interface props{
    accountId:string,authUserId:string,name:string,username:string,imgUrl:string,bio:string,type?:string
}

const ProfileHeader = ({accountId,authUserId,name,username,imgUrl,bio,type,}:props) => {
  return (
    <div className="flex w-full flex-col justify-start">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Image src={imgUrl} alt="Profile Image" width={64} height={64} className="rounded-full object-cover shadow-2xl" />
                <div className="flex-1">
                    <h2 className="text-left text-heading3-bold text-light-1">
                        {name}
                    </h2>
                    <p className="text-base-medium text-gray-1">@{username}</p>
                </div>
            </div>
            {accountId===authUserId && type !== "Community" &&(
                <Link href='/profile/edit'>
                    <div className="flex">
                        <Image src='/assets/edit.svg' alt='logout' width={16} height={16}/>
                        <p className='text-light-2 max-sm:hidden'>Edit</p>
                    </div>
                </Link>
            )}

        </div>

        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
        <div className="mt-12 h-0.5 w-full bg-dark-3"/>
    </div>
  )
}

export default ProfileHeader