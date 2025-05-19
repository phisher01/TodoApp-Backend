// controllers/projects.js
const Project = require('../models/projectModel');
const User    = require('../models/userModel');

exports.createProject = async (req, res) => {
  try {
    const userId = req.body.user; // set by your auth middleware

    // 1️⃣ Ensure user exists and hasn’t hit the 4-project limit
    const user = await User.findById(userId).select('projects');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.projects.length >= 4) {
      return res.status(400).json({ message: 'Maximum of 4 projects allowed' });
    }

    // 2️⃣ Create the project
    const { title, description = '' } = req.body;
    const project = await Project.create({
      title,
      description,
      user: userId
      // pendingTasks & completedTasks default to 0
    });

    // 3️⃣ Add project ID to user and save
    user.projects.push(project._id);
    await user.save();

    // 4️⃣ Return the newly created project
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// controllers/projects.js


exports.getProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find the project by its _id
    const project = await Project.findById(projectId)
      .select('title description pendingTasks completedTasks createdAt updatedAt');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
