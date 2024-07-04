import { getParentThread } from "@/lib/actions/thread.actions";
import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";

interface threadprops{
    id:string,
    currentUserid:string,
    comments:{
        author:{
            image:string;
        }
    }[],
    parentid:string,
    createdAt:string,
    content:string,
    author:{
        name:string,
        image:string,
        id:string,
    },
    community:{
        name:string,
        image:string,
        id:string
    } | null,
    isComment:boolean

}

const ThreadCard=async({author,currentUserid,comments,createdAt,parentid,community,id,content,isComment}:threadprops)=>{
    let parentThread=await getParentThread(parentid)
    if(community){
        console.log(community)
    }
    
return(
    <article className={`relative flex w-full flex-col rounded-xl pt-3 ${isComment ?('px-0 xs:px-7'):("bg-dark-2 p-7")} `}>

        <div className="flex items-start justify-between">
            <div className="flex w-full flex-1 flex-row gap-4">
                <div className="flex flex-col items-center">

                    <Link href={`/profile/${author.id}`}>
                        <Image src={author.image} alt="Profile image"  className="cursor-pointer rounded-full" width={24} height={24}/>
                    </Link>
                    <div className="thread-card_bar"/>
                </div>

                <div className="flex w-full flex-col">
                    <Link href={`/profile/${author.id}`} className="w-1/2">
                    <h4 className="cursor-pointer text-base-semibole text-light-3">{author.name}</h4>
                    </Link>

                    <Link href={`/thread/${id}`}>
                    <h2 className=" mt-2 text-small-regular text-light-2">{content}</h2>
                    </Link>
                    <div className="mt-5 flex flex-col gap-3">
                        <div className="flex gap-3.5">
                            <Image src="/assets/heart-gray.svg" alt="like" width={24} height={24}></Image>
                        </div>
                        {isComment && comments.length>0 &&(
                            <Link href={`/thread/${id}`}>
                                <p className="mt-1 text-subtle-medium text-gray-1">
                                    {comments.length} replies

                                </p>
                            </Link>
                        )}
                    </div>
                </div>
                    
            </div>
            
           <DeleteThread 
                threadId={JSON.stringify(id)}
                currentUserid={currentUserid}
                authorId={author.id}
                parentid={parentid}
                isComment={isComment}
            />
            
        </div>
            {!isComment && comments.length>0 && (
                <div className="ml-1 mt-3 flex items-center gap-2">
                    {comments.slice(0,2).map((comment,index)=>(
                        <Image
                            key={index}
                            src={comment.author.image}
                            alt="author image"
                            width={24}
                            height={24}
                            className={`${index!=0 &&("-ml-5")}rounded-full object-cover`}
                        />
                    ))}

                    <Link href={`/thread/${id}`}>
                    <p className="mt-1 text-subtle-medium text-gray-1">
                        {comments.length} repl{(comments.length>1)? ("ies"):("y")}
                    </p>
                    </Link>
                </div>
            )}
            {!isComment && community &&(
                <Link href={`/community/${community.id}`} className="mt-5 flex items-center">
                <p className="text-subtle-medium text-gray-1">
                    {formatDateString(createdAt)}
                    {community && ` -${community.name} Community`}
                </p>

                 <Image src={community.image} alt={community.name} height={19} width={19} className='ml-1 rounded-full object-cover'/>
                </Link>
            )}
      
        {parentid && 
                <div className="absolute w-2/3   text-small-regular bottom-2 right-0">
                    <div className="flex flex-row gap-1">
                        <p className="text-sky-700">replied to {parentThread.author.id==author.id?("yourself"):(`@${parentThread.author.name}`)}-</p>
                        <Link href={`/thread/${parentThread.id}`}><p className="text-light-1 max-w-[100px] overflow-hidden truncate cursor-pointer hover:text-light-4">"{parentThread.text}"</p>
                        </Link>
                    </div>
                 
                </div>
}  

    </article>
)
}

export default ThreadCard