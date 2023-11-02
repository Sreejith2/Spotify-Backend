import mongoose from "mongoose";

 async function connection(){
    const connectionParams ={
    }
    try{
        await mongoose.connect(process.env.DB,connectionParams);
        console.log("Connected to database");
    }catch(error){
        console.log(`Could not connect to the database due to ${error}`);
    }
}

export default connection;