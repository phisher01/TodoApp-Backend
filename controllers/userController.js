
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const User=require("../models/userModel")


const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
   
    let existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

 
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    
    res.status(201).json({
      token,
      userId: newUser._id
      
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account with this email" });
    }

  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    
    res.json({  
      token,
      userId:user._id 
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      taskStats: user.taskStats
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  signup,
  login,
  getUserProfile
};
