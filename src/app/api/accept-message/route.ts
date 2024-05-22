import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    console.log("this is getServerSession(authOptions) Session " , session)
    const user : any = session?.user

    if(!session || !user.session){
        return Response.json({
            success : false,
            message : "Not authencated"
        },{status : 401})
    }

    const userId = user._id

    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessages },
            {new : true}
        )

        if(!updatedUser){
            return Response.json({
                success : false,
                message : "Failed to update user status to accept messages",
            },{status : 401})
        }

        return Response.json({
            success : true,
            message : "Message acceptance status updated successfully",
            updatedUser

        },{status : 200})
        

        

    } catch (error) {
        console.log("Failed to update user status to accept messages ", error)
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages"
        },{status : 500})
    }
}


export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    console.log("this is getServerSession(authOptions) Session " , session)
    const user : any = session?.user

    if(!session || !user.session){
        return Response.json({
            success : false,
            message : "Not authencated"
        },{status : 401})
    }

    const userId = user._id

   try {
        const foundUser = await UserModel.findById(
            userId
        )
        if(!foundUser){
            return Response.json({
                success : false,
                message : "User Not found",
            },{status : 404})
        }
        return Response.json({
            success : true,
            isAcceptingMessage : foundUser.isAcceptingMessage,
        },{status : 200})
   } catch (error) {
        console.log("Error in getting message acceptance error ", error)
            return Response.json({
                success : false,
                message : "Error in getting message acceptance error" 
            },{status : 500})
   }
}