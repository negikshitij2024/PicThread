"use client"


import { threadValidation } from "@/validations/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useOrganization } from "@clerk/nextjs"
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
import { Textarea } from "../ui/textarea"
import { redirect, usePathname, useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/thread.actions"
import { useToast } from "../ui/use-toast"

export function PostThread({userid}:{userid:string}) {

    const {organization} = useOrganization()

    const path=usePathname()
    const router=useRouter()
    const {toast}=useToast()
    const form = useForm<z.infer<typeof threadValidation>>({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: "",
            accountid: userid
        },
    })

     function onSubmit(values: z.infer<typeof threadValidation>) {
        createThread({author:userid,text:values.thread,path:path,communityId:organization? organization.id : null})
        .then(()=>{
            
        toast({
            description:"Thread Created"
        })

        router.push('/')
        })
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">Content</FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea rows={16} placeholder="Enter your Thread" {...field} />
                            </FormControl>
                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">PostThread</Button>
            </form>
        </Form>
    )

}