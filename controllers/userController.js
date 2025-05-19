
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");

const User=require("../models/userModel")

    
//     const getAllUsers=async(req,res)=>{
       
//         try{
//             const users=await User.find({});
//             res.json(users);      
//         }catch(err){
//             console.error("Error during fetching",err);
//             res.status(500).send("Server Error");
        
//         }
// }


const signup = async (req, res) => {
  const { name, email, password, country } = req.body;
  try {
    // 1️⃣ Check for existing user by email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create & save the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      projects: []   // start with no projects
    });
    await newUser.save();

    // 4️⃣ Sign JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // 5️⃣ Respond with token & basic user info
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
    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found for this email" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password entered" });
    }

    // 3️⃣ Sign JWT with user ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // 4️⃣ Respond with token and user info
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
    const user = await User.findById(id)
      .select('-password')             // exclude the hashed password
      .populate({
        path: 'projects',
        select: 'title description pendingTasks completedTasks createdAt'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

//     const updateUserProfile=async(req,res)=>{
        
        
//         const currentID=req.params.id;
//         const{email,password}=req.body;
//         try{
//             const user=await  User.findOne({email});
//             if(user){
//                 return res.status(400).json({message:"Email already has been used"});

//             }
//             let updateFields={
//                 email,  
//             }
//             if(password){
//                 const salt=await bcrypt.genSalt(10);
//                 const hashedPassword=await bcrypt.hash(password,salt);
//                 updateFields.password=hashedPassword;
                
                
//             }
//             const result=await User.findByIdAndUpdate(currentID,{$set:updateFields},{new:true});
         
//             if(!result){
                
//                 return res.status(404).json({message:"User not found"});
//             }
           
//             res.send(result);
            
//         }catch(err){
            
//             console.error("Error during updating",err);
//             res.status(500).send("Server Error");
    
            
//         }
    
    
// }
// const deleteUserProfile=async(req,res)=>{
//     const currentID=req.params.id;
//     try{
            
       
//         const result=await User.findByIdAndDelete(currentID);
//         if(!result){
            
//             return res.status(404).json({message:"User not found"});
//         }
//         res.json({message:"User Profile Deleted"});
        
//     }catch(err){
        
//         console.error("Error during deleti  ng",err);
//         res.status(500).send("Server Error");

        
//     }


// }
module.exports={
    // getAllUsers,
    signup,
    login,
    getUserProfile,
    // updateUserProfile,
    // makeStar,
    // deleteUserProfile,

};
