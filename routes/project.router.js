
const express=require("express");
const projectController=require("../controllers/projectController");
const projectRouter=express.Router();

projectRouter.post('/projects',projectController.createProject);
projectRouter.get('/projects/:id', projectController.getProject);

module.exports=projectRouter;



