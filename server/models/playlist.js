import mongoose from "mongoose";
import joi from "joi";

const ObjectId = mongoose.Schema.Types.ObjectId;

const playListSchema = new mongoose.Schema({
    name:{type:String,required:true},
    user:{type:ObjectId,ref:"user",required:true},
    desc:{type:String},
    songs:{type:[String],default:[]},
    img:{type:String},
});

const validate = (playlist)=>{
    const schema = joi.object({
        name:joi.string().required(),
        user:joi.string().required(),
        desc:joi.string().allow(),
        songs:joi.array().items(joi.string()),
        img:joi.string().allow(),
    });
    return schema.validate(playlist);
}

const PlayList = mongoose.model("playlist",playListSchema);

export default {PlayList,validate};