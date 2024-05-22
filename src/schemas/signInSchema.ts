import { z } from "zod";
//identifier is name email (identifier is used in the production and better word to use in production)
export const signInSchema = z.object({
    identifier : z.string(),
    password : z.string()
})