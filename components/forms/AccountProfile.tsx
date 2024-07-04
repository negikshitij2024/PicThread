"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { array, z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserValidation } from "@/validations/user"
import Image from "next/image"
import { Textarea } from "../ui/textarea"
import { ChangeEvent, useState } from "react"
import { isBase64Image } from "@/lib/utils"
import { useUploadThing } from "@/lib/uploadthing"
import { usePathname } from "next/navigation"
import { updateUser } from "@/lib/actions/user.actions"
import { useRouter } from "next/navigation"


interface props{
    user:{
        id:string;
        objectId:string;
    username:string;
    name:string;
    bio:string;
    image:string;
};
btnTitle:string;

}

const AccountProfile = ({user,btnTitle}:props) => {
    const pathname=usePathname()
    const router=useRouter()
    const [files,setFiles]=useState<File[]>([])
    const {startUpload}=useUploadThing("media")
    const form=useForm({
        resolver:zodResolver(UserValidation),
        defaultValues:{
            name:user?.name? user.name:"",
            username:user?.username? user.username:"",
            bio:user?.bio? user.bio:"",
            profile_photo:user?.image? user.image:""
        },
    })
  
    const handleImage=(e:ChangeEvent<HTMLInputElement>,fieldChange:(value:string)=>void)=>{
        e.preventDefault()

        const filereader=new FileReader()

        if (e.target.files && e.target.files.length>0){
            const file=e.target.files[0]

            setFiles(Array.from(e.target.files))

            if(!file.type.includes('image')) return;

            filereader.onload=async(event)=>{
                    const imageurl=event.target?.result?.toString() || ""
                    fieldChange(imageurl)
                }
            filereader.readAsDataURL(file)
    
    }
}
    const onSubmit=async(values:z.infer<typeof UserValidation>)=>{
    const blob = values.profile_photo;

    const hasimageChanged=isBase64Image(blob)


    if(hasimageChanged){

      startUpload(files).then((imgRes)=>{
        if(imgRes && imgRes[0].url){
          values.profile_photo=imgRes[0].url
        }
      })
      
    }


    const userobject={
      name:values.name,
      username:values.username,
      image:values.profile_photo,
      id:user.id,
      path:pathname,
      bio:values.bio,
    }
    console.log(userobject)
    await updateUser(userobject)
    
    if(pathname==='/profile/edit')
      {
        router.back()
      }
      else{
        router.push('/')
      }

    }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
      <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="account-from_image-label">
                {field.value?(
                    <Image
                        src={field.value}
                        alt="profile photo"
                        height={54}
                        width={54}
                        priority
                        className="rounded-full object-contain cursor-pointer"
                    />
                ):(
                    <Image
                        src="/assets/profile.svg"
                        alt="profile photo"
                        height={24}
                        width={24}
                        priority
                        className="rounded-full object-contain cursor-pointer"
                    />
                )}
            </FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" placeholder="Upload a photo" onChange={(e)=>handleImage(e,field.onChange)} className="account-form_input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
            <p className="text-light-1">Name</p>
            </FormLabel>
            <FormControl>
              <Input type="text"  {...field} className="account-form_input" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
            <p className="text-light-1">Username</p>
            </FormLabel>
            <FormControl>
              <Input type="text"  {...field} className="account-form_input"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
               <p className="text-light-1">Bio</p>
            </FormLabel>
            <FormControl>
              <Textarea rows={10} placeholder="Your bio" {...field} className="account-form_input no-focus"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="bg-primary-500">Submit</Button>
    </form>
  </Form>
  )
}

export default AccountProfile