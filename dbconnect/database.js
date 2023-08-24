import mongoose from "mongoose";

export const connect = () => {
    mongoose.connect(`${process.env.MONGO_DB}`, {

    }).then(()=>{
        console.log("connected to database!")
    })
    .catch(err => {
        console.log(err)
    });
};