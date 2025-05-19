// controllers/tasks.js
const Task = require('../models/taskModel.js');
const Project = require('../models/projectModel.js');

// Create a new task under a specific project
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;

    // Create the task (completedAt will be set via schema setter)
    const task = await Task.create({
      title,
      description,
      project: projectId
    });

    // Increment pendingTasks counter on the project
    await Project.findByIdAndUpdate(
      projectId,
      { $inc: { pendingTasks: 1 } }
    );

    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all tasks for a given project
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a specific task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Track status change for counter updates
    const prevStatus = task.status;

    // Update fields
    if (title !== undefined)       task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined)      task.status = status;

    await task.save();

    // If status changed, update project counters
    if (status && status !== prevStatus) {
      const inc = {};
      if (prevStatus !== 'Completed' && status === 'Completed') {
        inc.completedTasks = 1;
        inc.pendingTasks = -1;
      } else if (prevStatus === 'Completed' && status !== 'Completed') {
        inc.completedTasks = -1;
        inc.pendingTasks = 1;
      }
      if (Object.keys(inc).length) {
        await Project.findByIdAndUpdate(task.project, { $inc: inc });
      }
    }

    res.json(task);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
  exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Delete a specific task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Decrement the appropriate counter on the project
    const field = task.status === 'Completed' ? 'completedTasks' : 'pendingTasks';
    await Project.findByIdAndUpdate(task.project, { $inc: { [field]: -1 } });

    res.sendStatus(204);
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
