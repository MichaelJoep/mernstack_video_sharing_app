import Video from "../models/Video.js"
import { createError } from "../utils/errorhandler.js";
import User from "../models/User.js";

export const addVideo = async (req, res, next) => {
 const newVideo = await new Video({userId:req.user.id, ...req.body});

 try {
    const savedVideo = await newVideo.save();

    res.status(200).json(savedVideo)
 } catch (err) {
    next(err)
 }
}

export const updateVideo = async (req, res, next) => {
    try {

        const video = await Video.findById(req.params.id);

        //if video does not exist
        if(!video) return next(createError(403, "Video not found"));

        if(req.params.id === req.user.id) {
            //find and update video
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,
                 {
                    $set: req.body,
                 }, { new: true})
                
                res.status(200).json({
                    success: true,
                    updatedVideo
              })
                
        } else {
            return next(createError(403, " You can only update your video!"))
        }
    } catch (err) {
        next(err)
    }
}

export const deleteVideo = async (req, res, next) => {
    
    try {

        const video = await Video.findById(req.params.id);

        //if video does not exist
        if(!video) return next(createError(403, "Video not found"));

        if(req.params.id === req.user.id) {
            //find and delete video
            await Video.findByIdAndDelete(req.params.id)
            res.status(200).json("Video deleted successfully!")
                
        } else {
            return next(createError(403, " You can only delete your video!"))
        }
    } catch (err) {
        next(err)
    }
}

export const getVideo = async (req, res, next) => {
   try {
    const video = await Video.findById(req.params.id);

    //if no video
    if(!video) return next(createError(403, "No video found!"));

    res.status(200).json(video)
   } catch (err) {
    next(err)
   }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: {views: 1}
        }, {new: true})
        res.status(200).json("Views has been increased!")
    } catch (err) {
        next(err)
    }
}

export const trendVideo = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({views: -1});
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}

export const randomVideo = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{$sample : {size: 40}}]);
        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

export const subVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({userId: channelId});
            })
        );
        res.status(200).json(list.flat().sort((a, b)=> b.createdAt - a.createdAt));
    } catch (err) {
        next(err)
    }
}

export const tagVideos = async (req, res, next) => {
    const tags = req.query.tags?.split(",")
    try {
        const videos = await Video.find({tags: {$in: tags }}).limit(20);

        res.status(200).json(videos)
    } catch (err) {
        next(err)
    }
}

export const searchVideos = async (req, res, next) => {
    const search = req.query.q
    try {
        const videos = await Video.find({title: 
            {$regex: search, $options: "i"}}).limit(40);
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}