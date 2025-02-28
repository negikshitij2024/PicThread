import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/Topbar";
import Leftsidebar from "@/components/shared/Leftsidebar";
import Rightsidebar from "@/components/shared/Rightsidebar";
import Bottombar from "@/components/shared/Bottombar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata={
  title:'PicThread',
  description:'A next.js 13 meta threads app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      
      <body className={inter.className}>
        
        <Topbar/>
        <main className="flex flex-row">
         <Leftsidebar/> 
         <section className="main-container">
          <div className="w-full max-w-4xl">{children}</div>
          </section> 
         {/* <Rightsidebar/>  */}
        </main> 
        <Bottombar/> 
      <Toaster/>
      </body>
    </html>
    </ClerkProvider>
  );
}
