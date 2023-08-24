import express from "express";
import { 
    addVideo, 
    addView, 
    deleteVideo, 
    getVideo, 
    randomVideo, 
    searchVideos, 
    subVideo, 
    tagVideos, 
    trendVideo, 
    updateVideo
    } from "../controllers/video.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();


//CREATE A VIDEO
router.post("/", verifyToken, addVideo)

//UPDATE VIDEO
router.put("/:id", verifyToken, updateVideo)

//FIND VIDEO
router.get("/find/:id", getVideo)

//DELETE VIDEO
router.delete("/:id", verifyToken, deleteVideo)

//VIEW VIDEO
router.put("/view/:id",  addView)

//Trending VIDEOS
router.get("/trend", trendVideo)

//GET SUBSCRIBED VIDEOS
router.get("/sub", verifyToken, subVideo);


//RANDDOM VIDEOS
router.get("/random",  randomVideo)

//TAGS CHANNEL VIDEOS
router.get("/tags",  tagVideos)

//SEARCH CHANNEL VIDEOS
router.get("/search",  searchVideos)



export default router;