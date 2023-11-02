import express from "express";
import userModule from "../models/user.js";
import bcrypt from "bcrypt";
const router = express.Router();
const User = userModule.User;
router.post("/",async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({message:"Invalid email or password"});
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){return res.status(400).send({message:"Invalid email or password"});}
    const token = user.generateAuthToken();
    res.status(200).send({data:token,message:"Signing in please wait..."});
});

export default router;