import '../globals.css'
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"

// do the seo
export const metadata={
    title:"PicThread",
    description:"A Next.js 13 Meta Threads App"
}

const inter=Inter({subsets:["latin"]})

const RootLayout=({children}:{children:React.ReactNode})=>{
return(

 <ClerkProvider>
  <html lang="en">
    <body className={`${inter.className} bg-dark-1`}>
   <div className="flex w-full justify-center items-center min-h-screen">
   {children}
    </div> 
    </body>
     </html>
   


 </ClerkProvider>


)
}

export default RootLayout