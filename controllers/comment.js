import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import { createError } from "../utils/errorhandler.js";

//Post comment => /api/comment/
export const addComment = async (req, res, next) => {
    const newComment = new Comment({...req.body, userId: req.user.id})
    try {

        const savedComment = await newComment.save();
        res.status(200).json(savedComment)
        
    } catch (err) {
        next(err)
    }
}

//GET Comment => /api/comment/videoId
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({videoId: req.params.videoId})

        res.status(200).json(comments);
    } catch (err) {
        next(err)
    }
}

//DELET Comment => /api/comment/userId
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(req.params.id)

        if(req.user.id === comment?.userId || req.user.id === video?.userId) {
            await Comment.findByIdAndDelete(req.params.id);

            res.status(200).json("The comment has been deleted!");
        } else {
            return next(createError(403, "You can only delete your comment!"))
        }
        
    } catch (err) {
        next(err)
    }
}