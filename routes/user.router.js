const express=require("express");
const userRouter=express.Router();

const userController=require("../controllers/userController");


userRouter.post("/signup",userController.signup);

userRouter.post("/login",userController.login);
userRouter.get("/userProfile/:id",userController.getUserProfile);


module.exports=userRouter;