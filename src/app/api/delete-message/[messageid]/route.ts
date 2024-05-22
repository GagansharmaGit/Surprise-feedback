import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export async function DELETE(request:Request , {params} : {params : {messageid : string}} ){
    const messageId = params.messageid;
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

    //it is used because we have converted the id in the session to string, not it is used to 
    // conver the string to again onjectId type of mongo db 
    try {
       const updateResult = await UserModel.updateOne(
            {id : user._id},
            {$pull : {messages : {_id : messageId}}}
        )
        console.log("This is updated Result from the delete-message route",updateResult);

        if(updateResult.modifiedCount == 0){
            return Response.json({
                success : false,
                message : "Message not found or already deleted"
            },{status : 404})
        }
        return Response.json({
            success : true,
            message : "Message Deleted"
        },{status : 200})
    } catch (error) {
        console.log("Error in deleting message", error);
        return Response.json({
            success : false,
            message : "Error While deleting Message"
        },{status : 500})
    }

    

}