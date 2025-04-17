const Repository = require("../models/repoModel");
 const Issue=require("../models/issueModel")

const User = require("../models/userModel");


const createIssue=async(req,res)=>{
   const {title,description}=req.body;
   const {id}=req.params;
   try{

       
       const issue= new Issue({
           title,
           description,repository:id
        });
        await issue.save();
      await   Repository.findByIdAndUpdate(id,{$push:{issues:issue._id}})
        
        res.status(201).json(issue);
        
    }catch(err){
        console.log("Error during issue creation : ",err);
        res.status(500).send("Server Error")
    }

}

const updateIssueById=async (req,res)=>{
    const {title,description,status}=req.body;
    const {id}=req.params;
    try{
 
       const issue=await Issue.findById(id);
       if(!issue){
        return res.status(404).json({Error:"Issue not found! "});

       }
            issue.title=title||issue.title;
               issue.description=description||issue.description;
               issue.status=status||issue.status;
              await  issue.save();
              res.json(issue);         
     }catch(err){
         console.log("Error during issue updation : ",err);
         res.status(500).send("Server Error")
     }

 
}

const deleteIssueById=async(req,res)=>{
    const {id}=req.params;
    try{
 
       await Issue.findByIdAndDelete(id);
        if(!issue){
         return res.status(404).json({Error:"Issue not found! "});
 
        }
            res.json({message:"Issue deleted!"})
      }catch(err){
          console.log("Error during issue deletion : ",err);
          res.status(500).send("Server Error")
      }
 
  
}
   

const getAllIssues=async (req,res)=>{
  const {id}=req.params;
  try{
    const issues=await Issue.find({repository:id  });
    if(issues.length==0 ){
        return res.status(404).json({Error:"Issues not found! "});
        
    }
    return  res.json(issues);

  }catch(err){
    console.log("Error during issues fetching : ",err);
    res.status(500).send("Server Error")
}

}
const getIssueById=async (req,res)=>{
    const {id}=req.params;
  try{
    const issue=await Issue.findById(id  );
    if(!issue ){
        return res.status(404).json({Error:"Issues not found! "});
        
    }
    return  res.json(issue);

  }catch(err){
    console.log("Error during issue fetching : ",err);
    res.status(500).send("Server Error")
}
  
}

module.exports={getAllIssues,
    deleteIssueById,
    getIssueById,
    updateIssueById,
    createIssue
}

