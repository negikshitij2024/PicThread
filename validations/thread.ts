import { z } from "zod";

export const threadValidation=z.object({
    thread:z.string().min(3,{message:"a thread must be of minimum 3 characters"}),
    accountid:z.string()
})

export const commentValidation=z.object({
    thread:z.string().min(3,{message:"a thread must be of minimum 3 characters"}),
    accountid:z.string()
})