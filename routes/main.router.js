const express=require("express");
const  userRouter  = require("./user.router");
const  taskRouter  = require("./task.router");

const mainRouter=express.Router();


mainRouter.use(userRouter);
mainRouter.use(taskRouter);



mainRouter.get("/",(req,res)=>{
    res.send("welcome!");
    
});

module.exports=mainRouter;
