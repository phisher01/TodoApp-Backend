



const fs=require("fs").promises;
const { flushCompileCache } = require("module");
const path=require("path");


async function addRepo(file){

   
    const repoPath=path.resolve(process.cwd(),".DevTrack");
    const stagingPath=path.join(repoPath,"staging");

    try{

       await fs.mkdir(stagingPath,{recursive:true});
        let filename=path.basename(file);
        await fs.copyFile(file,path.join(stagingPath,filename));
        console.log(`File ${filename} added to the staging area!`)
    }catch(err){
        console.log("Error handling file:",err);

    }
    

}
    module.exports={addRepo}