import mongoose from "mongoose";

function fun(req,res,next){
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(404).send({message:"Invalid Id"});
    }
    next();
}

export default fun;