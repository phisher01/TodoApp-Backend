const express = require("express");
const taskController = require("../controllers/taskController");
const taskRouter = express.Router();


taskRouter.post("/tasks", taskController.createTask);


taskRouter.get('/users/:userId/tasks', taskController.getTasksByUser);



taskRouter.put("/tasks/:taskId", taskController.updateTask);


taskRouter.patch("/tasks/:taskId/mark-done", taskController.markAsDone);


taskRouter.delete("/tasks/:taskId", taskController.deleteTask);


taskRouter.get("/tasks/:taskId", taskController.getTaskById);

taskRouter.get('/users/:userId/tasks/pending', taskController.getPendingTasks);
taskRouter.get('/users/:userId/tasks/completed', taskController.getCompletedTasks);


module.exports = taskRouter;
