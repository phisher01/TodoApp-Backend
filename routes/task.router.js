

const express=require("express");
const taskController=require("../controllers/taskController");
const taskRouter=express.Router();

taskRouter.post('/projects/:projectId/tasks',  taskController.createTask);

taskRouter.get('/projects/:projectId/tasks',  taskController.getTasksByProject);
taskRouter.put('/tasks/:taskId',  taskController.updateTask);
taskRouter.delete('/tasks/:taskId',  taskController.deleteTask);
taskRouter.get('/tasks/:taskId',  taskController.getTaskById);

module.exports =taskRouter;