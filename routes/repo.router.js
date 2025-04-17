
const express=require("express");
const repoController=require("../controllers/repoController");
const repoRouter=express.Router();

repoRouter.post( "/repo/create",repoController.createRepo);
repoRouter.get("/repo/all",repoController.getAllrepositories);
repoRouter.get("/repo/user/:id",repoController.fetchRepositoriesforCurrentUser);
repoRouter.get("/repo/:id",repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name",repoController.fetchRepositoryByName);
repoRouter.put("/repo/update/:id",repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id",repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id",repoController.toggleVisiblityById);

module.exports=repoRouter;



