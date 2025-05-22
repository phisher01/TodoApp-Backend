const Task = require("../models/taskModel");
const User = require("../models/userModel");

exports.createTask = async (req, res) => {
  const { userId, title, description } = req.body;

  try {
    const task = await Task.create({ userId, title, description });

  
    await User.findByIdAndUpdate(userId, {
      $inc: { "taskStats.total": 1, "taskStats.pending": 1 }
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};


exports.getTaskById = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Task not found" });
  }
};


exports.getTasksByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to get tasks" });
  }
};


exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { title, description},
      { new: true }
    );
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};
exports.markAsDone = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.status === "completed") {
      task.status = "pending";
      await User.findByIdAndUpdate(task.userId, {
        $inc: { "taskStats.completed": -1, "taskStats.pending": 1 }
      });
    }
    else{
      task.status = "completed";
      await User.findByIdAndUpdate(task.userId, {
        $inc: { "taskStats.completed": 1, "taskStats.pending": -1 }
      });

      }
      

    await task.save();



    res.status(200).json({ message: "Task is toggled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark task as done" });
  }
};

exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

   
    const field = task.status === "completed" ? "completed" : "pending";
    await User.findByIdAndUpdate(task.userId, {
      $inc: { [`taskStats.${field}`]: -1, "taskStats.total": -1 }
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};

exports.getPendingTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId, status: "pending" });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending tasks" });
  }
};


exports.getCompletedTasks = async (req, res) => {
  const { userId } = req.params;

  try {
    const tasks = await Task.find({ userId, status: "completed" });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch completed tasks" });
  }
};

