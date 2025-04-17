

const { ComprehendMedical } = require("aws-sdk");
const fs=require("fs").promises;
const path =require("path");
const{promisify}=require("util");


async function revertRepo(commitID) {
    const repoPath=path.resolve(process.cwd(),".DevTrack");
    const commitPath=path.join(repoPath,"commits");
    try{

        const commitDir=path.join(commitPath,commitID);
        const files=await fs.readdir(commitDir);
        const parentDir=path.resolve(repoPath,"..");
        for (const file of files) {
            await fs.copyFile(path.join(commitDir,file),    path.join(parentDir,file));

            
        }
        console.log(`Commit ${commitID} reverted successfully!`);






    }catch(err){
        console.log("Error ",err);
    }





    


}


module.exports={revertRepo}