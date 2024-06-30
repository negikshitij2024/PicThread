"use client"
import Image from "next/image"
import { Input } from "../ui/input"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface props{
    routeType:string
}
const Searchbar = ({routeType}:props) => {
    const [search,setSearch]=useState("");
    const router=useRouter()

    useEffect(()=>{
        const delayDebounce=setTimeout(()=>{
            if(search){
                router.push(`/${routeType}?q=`+search);
            }else{
                router.push(`/${routeType}`)
            }
        },300)
        return()=>clearTimeout(delayDebounce)
    },[search,routeType])

  return (
    <div className="searchbar">
        <Image src="/assets/search-gray.svg" height={24} width={24} alt="search" className="object-contain"/>


        <Input id="text" value={search} onChange={(e)=>setSearch(e.target.value)}
            placeholder={`${routeType==="search"?("Search Creators"):("Search Communities")}`}
            className='no-focus searchbar_input'
        />
    </div>
  )
}

export default Searchbar