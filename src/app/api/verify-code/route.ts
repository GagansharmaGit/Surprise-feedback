import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request : Request){
    await dbConnect()
    try {
       const {username,code} = await request.json()
       const decodedUsername = decodeURIComponent(username)
       const user = await UserModel.findOne({
        username : decodedUsername,

       })


       if(!user){
            return Response.json({
                success : false,
                message : "User is not found"
            },{status : 500})
       }

       //is code and expiry valid
       const isCodeVlid = user.verifyCode === code
       const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

       if(isCodeExpired &&  isCodeVlid){
            user.isVerified = true
            const result = await user.save()
            return Response.json({
                success : true,
                message : "Account Verified Successfully"
            },{status : 200})
       }else if(!isCodeExpired){
            return Response.json({
                success : false,
                message : "Verfication code has expired, Please sign Up Again for new code"
            },{status : 400})
       }else{
            return Response.json({
                success : false,
                message : "Incorrect Verification code"
            },{status : 400})
       }



    } catch (error) {
        console.error("Error while verifying user",error)
        return Response.json({
            success : false,
            message : "Error while verifying user"
        },{status : 500})
    }
}