import express from "express";
import dotenv from "dotenv";
import { connect } from "./dbconnect/database.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import {errorMiddlewares} from "./middlewares/error.js"
//import all routes
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/video.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js"
const app = express();

dotenv.config({
    path: "./config/.env"
});




const PORT = process.env.PORT || 8000;


//connecting database
connect();


//middlewares
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.json())
app.use(errorMiddlewares);

//connecting Routes
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);



app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost/${PORT}`)
});