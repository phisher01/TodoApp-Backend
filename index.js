const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const express=require("express");




dotenv.config();
const mainRouter = require("./routes/main.router");



console.log(process.env.MONGODB_URI);



    


    const app=express();
const Port=process.env.PORT||3000;
app.use(express.json());
const mongoURI=process.env.MONGODB_URI;
 mongoose.connect(mongoURI)
    .then(()=>{console.log("MongoDB connected! ");})
    .catch((err)=>{console.error("Unable to connect!",err);});


app.use(cors({origin:"*"}));
app.use("/",mainRouter);



app.listen(Port,()=>{
console.log(`Server is running on port${Port}`);
});










