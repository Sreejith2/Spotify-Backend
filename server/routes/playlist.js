import express from "express";
import playListModule from "../models/playlist.js";
import songModule from "../models/song.js";
import userModel from "../models/user.js";
import auth from "../middleware/auth.js";
import validObjectId from "../middleware/validObjectId.js";
import joi from "joi";


const router = express.Router();
const PlayList = playListModule.PlayList;
const validate = playListModule.validate;
const Song = songModule.Song;
const User = userModel.User;

//create playlist

router.post("/",auth,async (req,res)=>{
    const {error}=validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const  user = await User.findById(req.user._id);
    const playlist = await PlayList({...req.body,user:user._id}).save();
    user.playList.push(playlist._id);
    await user.save();

    res.status(201).send({data:playlist});
});

//edit playlist by id
router.put("/edit/:id",[validObjectId,auth],async (req,res)=>{
    const schema =joi.object({
        name:joi.string().required(),
        desc:joi.string().allow(""),
        img:joi.string().allow("")
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const playlist = await PlayList.findById(req.params.id);
    if(!playlist){
        return res.status(404).send({message:"Playlist not found"});
    }
    const user = await User.findById(req.user._id);
    if(!user._id.equals(playlist.user)){
        return res.status(403).send({message:"User Dont have access to edit"});
    }
    playlist.name=req.body.name;
    playlist.desc = req.body.desc;
    playlist.img = req.body.img;
    await playlist.save();

    res.status(200).send({message:"Updated successfully"});
});

//add song to playlist
router.put("/add-song",auth,async (req,res)=>{
    const schema = joi.object({
        playlistId:joi.string().required(),
        songId:joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user)){
        return res.status(403).send({message:"User Dont have access to add song"});
    }
    if(playlist.songs.indexOf(req.body.songId)===-1){
        playlist.songs.push(req.body.songId);
    }
    await playlist.save();
    res.status(200).send({message:"Added to Playlist"});
});

//remove song from playlist
router.put("/remove-song",auth,async (req,res)=>{
    const schema = joi.object({
        playlistId:joi.string().required(),
        songId:joi.string().required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).send({message:error.details[0].message});
    }
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.body.playlistId);
    if(!user._id.equals(playlist.user)){
        return res.status(403).send({message:"User Dont have access to remove song"});
    }
    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index,1);
    await playlist.save();
    res.status(200).send({data:playlist,message:"Song removed from playlist"});
});

//User favourites playlists
router.get("/favourite",auth,async (req,res)=>{
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.find({_id:user.playList});
    res.status(200).send({data:playlist});
});

router.get("/random",auth,async (req,res)=>{
    const playlist = await PlayList.aggregate([{$sample:{size:10}}]);
    return res.status(200).send({data:playlist});
});

//get playlist by id and songs
router.get("/:id",[validObjectId,auth],async (req,res)=>{
    const playlist = await PlayList.findById(req.params.id);
    if(!playlist){
        return res.status(404).send({mesaage:"not found"});
    }
    const songs = await Song.find({_id:playlist.songs});
    res.status(200).send({data:{playlist,songs}});
});

//get all playlists
router.get("/",auth,async (req,res)=>{
    const playlist = await PlayList.find();
    res.status(200).send({data:playlist});
});

//delete playlist by id
router.delete("/:id",[validObjectId,auth],async (req,res)=>{
    const user = await User.findById(req.user._id);
    const playlist = await PlayList.findById(req.params.id);
    if(!user.id.equals(playlist.user)){
        return res.status(403).send({message:"User Dont have access to remove"});
    }
    const index = User.playList.indexOf(req.params.id);
    user.playList.splice(index,1);
    await user.save();
    await playlist.remove();
    res.status(200).send({message:"Removed from Library"});
});

export default router;