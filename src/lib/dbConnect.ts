import mongoose from "mongoose";

type ConnnectionObject = {
    isConnected? : number
}

const connection : ConnnectionObject = {}

async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to Database");
        return;
    }
    try {
        // const mongodbUrl = "mongodb+srv://sharmagagan192:7sN0WG6QRsOPjG6v@surp-feedback.k7ocwjr.mongodb.net/?retryWrites=true&w=majority&appName=surp-feedback";
        console.log(process.env.MONGODB_URL)
        const db = await mongoose.connect(process.env.MONGODB_URL || "");
        // console.log(db)
        connection.isConnected = db.connections[0].readyState;
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Database Connection FAIL", error);
        process.exit(1);
    }
}

export default dbConnect;