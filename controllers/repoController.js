const Repository = require("../models/repoModel");
 
const mongoose=require("mongoose");
const User = require("../models/userModel");

const getAllrepositories=async (req,res)=>{
try{
    const result=await Repository.find({}).populate("owner").populate("issues");
   
    res.json(result);
}catch(err){
    console.log("Error during fetching repositories :",err);
    res.status(500).send("Server Errro");
}
    
}

const fetchRepositoryById=async(req,res)=>{
const repoID=req.params.id;


try{
   const repo=await Repository.findById(repoID).populate("owner").populate("issues");
if(!repo){
  return   res.status(404).json({mesage:"Repository not found"});;

}
res.json(repo);
}catch(err){
    console.log("Error during fetching repository :",err);
    res.status(500).send("Server Errro");
}


}

const fetchRepositoryByName=async (req,res)=>{

    const repoName=req.params.name;
    try{
        const repo=await Repository.find({name:repoName}).populate("owner").populate("issues");
     if(!repo){
         return res.status(404).json({mesage:"Repository not found"});;
     
     }
     res.json(repo);
     }catch(err){
         console.log("Error during fetching repository :",err);
         res.status(500).send("Server Errro");
     }
    }
    
    
    const fetchRepositoriesforCurrentUser=async (req,res)=>{
        
        try{
            const userId=req.params.id;
           
            const repo=await Repository.find({owner:userId}).populate("owner").populate("issues");
        //     if(!repo|| repo.length==0){
        //      return res.status(404).json({mesage:"User Repositories not found"});
         
        //  }
         res.json(repo);
         }catch(err){
             console.log("Error during fetching  user repositories :",err);
             res.status(500).send("Server Error");
         }
}

    const createRepo=async(req,res)=>{
        const {owner , name ,issues,content ,description,visibility}=req.body;
        

        try{

            if(!name){
                return res.status(400).json({error:"Repository name is required! "})
            }
            const repo=await Repository.findOne({name});
            if(repo){
                return res.status(400).json({error:"Repository name is already in use "})


            }
            if(!mongoose.Types.ObjectId.isValid(owner)){
                return res.status(400).json({error:"Invalid user ID! "});
            }
            const newRepository=new Repository({
                name:name,
                description,
                issues,
                owner,
                content,
                visibility
            });
            const result=await newRepository.save();
          const user=  await User.findById(owner);
          user.repositories.push(result._id);
await user.save();

        
            // await User.findByIdAndUpdate(owner)
            res.status(201).json({message:"Repository created!",repositoryID:result._id})

        }catch(err){
            console.error("Error during repository  creation : ",err);
            res.status(500).send("Server    error");
        }


}
const updateRepositoryById=async(req,res)=>{
    const {id}=req.params;
    const{ content,description}=req.body;
    try{
        
        const repo=await Repository.findById(id);
        if(!repo){
            
            return res.status(404).json({mesage:" Repository not found"});;
        }
        repo.content.push(content);
        repo.description=description;
        const updatedRepo=await repo.save();      
        res.json({message:"Repositpry updated successfully!",repository:updatedRepo}); 
        
    }catch(err){
        console.log("Error during updating  user repository :",err);
        res.status(500).send("Server Errro");
    }
    
}
const deleteRepositoryById=async (req,res)=>{
    const {id}=req.params; 
   
    try{
       
        const repo=  await User.findByIdAndDelete(id);  
       
        if(!repo){

            return res.status(404).json({mesage:" Repository not found"});;
        }
  
res.json({message:"Repositpry deleted successfully!"}); 
        
     }catch(err){
         console.log("Error during updating  user repository :",err);
         res.status(500).send("Server Errro");
     }
   
}

const toggleVisiblityById=async (req,res)=>{
    const {id}=req.params; 
    try{
       
        const repo=await Repository.findById(id);
        if(!repo){

            return res.status(404).json({mesage:" Repository not found"});;
        }
        repo.visibility=!repo.visibility;
       
const updatedRepo=await repo.save();      
res.json({message:"Repository visibility toggled successfully!",repository:updatedRepo}); 
        
     }catch(err){
         console.log("Error during toggling visibility :",err);
         res.status(500).send("Server Error");
     }
    
}

module.exports={
    fetchRepositoriesforCurrentUser,
    fetchRepositoryById,
    fetchRepositoryByName,
    toggleVisiblityById,
    deleteRepositoryById,
    createRepo,
    getAllrepositories,
    updateRepositoryById
}