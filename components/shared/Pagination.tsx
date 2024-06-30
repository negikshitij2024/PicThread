"use client"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"

interface props{
    pageNumber:number,
    isNext:boolean,
    path:string
}
const Pagination = ({pageNumber,isNext,path}:props) => {

    const router=useRouter()
    const handleNavigation=(str:string)=>{
        let nextPageNumber=pageNumber

        if (str=="prev"){
            nextPageNumber=Math.max(1,pageNumber-1)
        }
        else if(str=="next"){
            nextPageNumber=pageNumber+1
        }

        if(nextPageNumber>1){
            router.push(`/${path}?page=${nextPageNumber}`)
        }
        else{
            router.push(`/${path}`)
        }

        if(!isNext && pageNumber ===1) return null
    }
  return (
    <div className="pagination">

        <Button onClick={()=>handleNavigation('prev')} disabled={pageNumber===1}>Prev</Button>
        <p className="text-small-semibold text-light-1">{pageNumber}</p>
        <Button onClick={()=>handleNavigation("next")} disabled={!isNext}>Next</Button>
    </div>
  )
}

export default Pagination