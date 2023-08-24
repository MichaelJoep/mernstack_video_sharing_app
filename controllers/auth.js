import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { createError } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";

//@signup user
// -> /api/auth/signup
export const signup = async(req, res, next) => {
    try {
       
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
        ...req.body,
        password:hash
        });
        await newUser.save();
        res.status(200).send("User has been created!");    

    } catch (err) {
        next(err);
    }
}

 //@signin user
 //signin with jwt
 // -> /api/auth/signin
 export const signin = async(req, res, next) => {
    try {

    //check if password or username is entered by user
    if(!req.body.name || !req.body.password) {
        return next(createError(400, "Please enter username and Password"));
    }

    //check if user exist
    const user = await User.findOne({name: req.body.name});
    if(!user) {
        return next(createError(404, "User not found!"))
    }
    //check if password is correct
    const isPasswordMatched = await bcrypt.compare(req.body.password, user.password);

    if(!isPasswordMatched) {
        return next(createError(400, "Wrong Credentials entered!"))
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

    //separating password from other user's details
    const {password, ...others} = user._doc;

    //send token to user with cookie
    res.cookie("access_token", token, {
        http: true
    }).status(200).json(others);
        
    } catch (err) {
        next(err)
    }
 }
 
 //Google Auth
 export const googleAuth = async(req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email})

        if(user) {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        //send token to user with cookie
        res.cookie("access_token", token, {
            http: true
        }).status(200).json(user._doc)
        } else {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save();
            const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET);
            //send token to user with cookie
            res.cookie("access_token", token, {
                http: true
            }).status(200).json(savedUser._doc);
        }
    } catch (err) {
        next(err)
        
    }
 }

 //Logout ==> api/auth/logout

 export const logout = async(req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).send("User has been logged out successfully!")
 }
