import { z } from "zod";

export const messageSchema = z.object({
   content : z.string().min(10,{message : "content must be atlest 10 char"})
                .max(300,{message : "Content must be less than 300 words"})
   
})