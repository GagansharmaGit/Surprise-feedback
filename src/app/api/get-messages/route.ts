import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";


export async function GET(request:Request){
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
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {$match: {id:userId}},
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id: '$_id' , messages : {$push : '$messages'}}}
        ])

        if(!user || user.length == 0){
            return Response.json({
                success : false,
                message : "User Not found"
            },{status : 401})
        }

        console.log("This is user after aggregate pipeline : - ",user)

        return Response.json({
            success : true,
            message : user[0].message
        },{status : 200})

    } catch (error) {
        console.log("unExpected Error occoured ", error)
        return Response.json({
            success : false,
            message : "Error in Getting messages"
        },{status : 500})
    }

}