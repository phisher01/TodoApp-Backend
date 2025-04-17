
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
// const {MongoClient}=require("mongodb");
const User=require("../models/userModel")

    const uri=process.env.MONGODB_URI;
    // let client;
    // async function  connectClient() {
    //     if(!client){
    //         client=  new MongoClient(uri,{
    //             useNewUrlParser:true,
    //             useUnifiedTopology:true
    //         });
    //         await   client.connect();
            
    //     }
        
    // }
    

    const makeStar=async (req,res)=>{
      

        const {rid,uid}=req.params;
        try{

            
            const user=await  User.findById(uid);
            if(!user.starRepos.includes(rid)){

                user.starRepos.push(rid);
            }else{
                user.starRepos=user.starRepos.filter((id)=>{return id!=rid})
            }

            await user.save();
            


            res.json({message:"made repo starred for user"});
            
        }catch(err){
            res.status(500).json("Server Error");
        }
    
    
    
    
    }

    const getAllUsers=async(req,res)=>{
       
        try{
            const users=await User.find({});
            res.json(users);      
        }catch(err){
            console.error("Error during fetching",err);
            res.status(500).send("Server Error");
        
        }
}

const signup= async (req,res)=>{
    const {username,password,email}=req.body;
    try{
        
       
       
        const user=await User.findOne({$or:[{username},{email}]});
        if(user){
            return   res.status(400).json({message:"User already exists"});
        }
        
        

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
    
   const newuser= new User({
    username,
password:hashedPassword,
email

});
await newuser.save();

// const result=await usersCollection.insertOne(newUser);
// console.log(result);

const token=jwt.sign({id:newuser._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
// const token=jwt.sign({id:user.insertId}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
res.json({token,userId:newuser._id});






    
}catch(err){
    console.error("Error during Singup:",err.message);
    res.status(500).send("Server Error");
    
    
}
}
const login=async (req,res)=>{
    const {email,password}=req.body;
    
    try{
        const user=await User.findOne({email});
        if(!user){
           return  res.status(404).json({message:"User not found for this email"});
        }
      
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(404).json({message:"Wrong Password Enter"});
        }
        
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:user._id});
        
        
    }catch(err){
        console.error("Error during login",err);
        res.status(500).send("Server Error");
    }}  
    
    const   getUserProfile=async (req,res)=>{
        
        
        const currentID=req.params.id;
        try{
            const user=await User.findById(currentID).populate("starRepos");
            if(!user){
                return res.status(404).json({message:"User not found"});
                
            }
            res.json(user);
        }catch(err){
            console.error("Error during fetching",err);
            res.status(500).send("Server Error");   
        }
        
        
    }
    const updateUserProfile=async(req,res)=>{
        
        
        const currentID=req.params.id;
        const{email,password}=req.body;
        try{
            const user=await  User.findOne({email});
            if(user){
                return res.status(400).json({message:"Email already has been used"});

            }
            let updateFields={
                email,
            }
            if(password){
                const salt=await bcrypt.genSalt(10);
                const hashedPassword=await bcrypt.hash(password,salt);
                updateFields.password=hashedPassword;
                
                
            }
            const result=await User.findByIdAndUpdate(currentID,{$set:updateFields},{new:true});
         
            if(!result){
                
                return res.status(404).json({message:"User not found"});
            }
           
            res.send(result);
            
        }catch(err){
            
            console.error("Error during updating",err);
            res.status(500).send("Server Error");
    
            
        }
    
    
}
const deleteUserProfile=async(req,res)=>{
    const currentID=req.params.id;
    try{
            
       
        const result=await User.findByIdAndDelete(currentID);
        if(!result){
            
            return res.status(404).json({message:"User not found"});
        }
        res.json({message:"User Profile Deleted"});
        
    }catch(err){
        
        console.error("Error during deleti  ng",err);
        res.status(500).send("Server Error");

        
    }


}
module.exports={
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    makeStar,
    deleteUserProfile,

};
