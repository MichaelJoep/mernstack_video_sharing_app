import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.js"
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//POST Comment
//Signed in users can post comments
router.post("/", verifyToken, addComment)

//DELETE Comment
//Signed in users can delete comments
router.delete("/:id", verifyToken, deleteComment)

//GET Comment
//users can find comments
router.get("/:videoId", getComments)

export default router;