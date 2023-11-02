import express from "express";
import songModel from "../models/song.js";
import playlistModel from "../models/playlist.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const Song = songModel.Song;
const PlayList = playlistModel.PlayList;

router.get("/",auth,async (req,res)=>{
    const search = req.query.search;
    if(search!==""){
        const songs = await Song.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const playlists = await PlayList.find({
            name:{$regex:search,$options:"i"}
        }).limit(10);
        const result = {songs,playlists};
        res.status(200).send({data:result});
    }else{
        res.status(200).send({})
    }
});

export default router;