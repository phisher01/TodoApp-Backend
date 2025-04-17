
const fs=require("fs").promises;
const path=require("path");

const {b2,b2_Bucket}=require("../config/backblaze-config");



async function pushRepo() {
    const repoPath=path.resolve(process.cwd(),".DevTrack");
    const commitsPath=path.join(repoPath,"commits");

    try{
        const commitDirs   =await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {
            const commitPath=path.join(commitsPath,commitDir);
            const files= await fs.readdir(commitPath);
            for (const file of files) {
                const filePath=path.join(commitPath,file);
                const fileContent=await fs.readFile(filePath);
                const params={
                        Bucket:b2_Bucket,
                        Key:`commits/${commitDir}/${file}`,
                        Body:fileContent
                };
                await b2.upload(params).promise();
               
                
            }
            
        }
        console.log("All files are pushed to B2")

    }catch(err){
        console.error("Error pushing to B2: ",err) ;
      }



    
}
module.exports={pushRepo}