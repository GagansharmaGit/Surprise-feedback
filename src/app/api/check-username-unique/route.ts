import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";



const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request : Request){
  
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }
        console.log("this is queryParams",queryParams) // TODO Remove
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log("this is result",result) // TODO Remove

        if(!result.success){
            console.log("here in !result.success before ",)
            console.log("here in !result.success before")
            console.log("here in !result.success before")
            const usernameErrors = result.error.format().username?._errors || []
            console.log("here in !result.success after,", usernameErrors)
            return Response.json({
                success : false,
                message : usernameErrors.length > 0 ? 
                         usernameErrors.join(", ") :
                            "Invalid username parameters"
            })
        }

        const {username} = result.data
        console.log("This is result.data ",username);
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified : true
        })
        console.log("This is existingVerifiedUser ",existingVerifiedUser);

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "Username is already taken"
                            
            },{status:404})
        }
        console.log("I am sending ok")
        return Response.json({
            success : true,
            message : "Username is Unique and available"
                        
        },{status:200})

    } catch (error) {
        console.error("Error while checking username",error)
        return Response.json({
            success : false,
            message : "Error while checking username"
        },{status : 500})
    }
}