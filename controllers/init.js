

const fs=require("fs").promises;    
const { chownSync } = require("fs");
const { exec } = require('child_process');
const path=require("path");


async function initRepo(){
   const repoPath=path.resolve(process.cwd(),".DevTrack");
   const commitPath=path.join(repoPath,"commits");


   try{

    await fs.mkdir(repoPath,{recursive:true});
    await fs.mkdir(commitPath,{recursive:true});
    await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({bucket:process.env.S3_Bucket}));


    
    if (process.platform === "win32") {
        exec(`attrib +h "${repoPath}"`, (err) => {
            if (err) {
                console.error("Failed to hide folder on Windows:", err);
            } 
        });
    }

    console.log( "Repository Iniitialised! ");


   }catch(err){
    console.log("Error initialising repsitory ",err);



   }








}

module.exports={initRepo}