"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { commentValidation } from "@/validations/thread"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { addCommentToThread } from "@/lib/actions/thread.actions"
import { useToast } from "../ui/use-toast"
interface props{
    threadId:string,
    userImage:string,
    userId:string
}
const Comment=({threadId,userImage,userId}:props)=>{
    const pathname=usePathname()
    const {toast}=useToast()
    const form = useForm<z.infer<typeof commentValidation>>({
        resolver: zodResolver(commentValidation),
        defaultValues: {
          thread: "",
          accountid:userId
        },
      })

      function onSubmit(values: z.infer<typeof commentValidation>) {
        addCommentToThread(threadId,values.thread,userId,pathname)
        .then(()=>{toast({
            description:"Comment Added"
        })
       form.reset()})
      }
return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
      <FormField
        control={form.control}
        name="thread"
        render={({ field }) => (
          <FormItem className="flex flex-row gap-3 items-center">
            <FormLabel><Image src={userImage} alt="user image" height={36} width={36} className="rounded-full"/></FormLabel>
            <FormControl>
              <Input type="text" placeholder="Comment..." {...field} className="bg-dark-2 text-white no-focus border-none"/>
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="submit"  className="mt-2 comment-form_btn">Post Comment</Button>
    </form>
  </Form>
)
}

export default Comment