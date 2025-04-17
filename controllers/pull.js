
const fs=require("fs").promises;
const path=require("path");
const{b2,b2_Bucket}=require("../config/backblaze-config");
const { PassThrough } = require("stream");


async function pullRepo() {



const repoPath=path.resolve(process.cwd(),".DevTrack");
const commitsPath=path.join(repoPath,"commits");
try{
    
    const data= await b2.listObjectsV2({Bucket:b2_Bucket,
        Prefix:"commits",

    }).promise();
    

const objects=data.Contents;
for (const obj of objects) {
    const key=obj.Key;
    const commitDir=path.join(commitsPath,path.dirname(key).split("/").pop());
    await fs.mkdir(commitDir,{recursive:true    });
    const filecontent=await b2.getObject({
        Bucket:b2_Bucket,   
        Key:key,
    }).promise();
    fs.writeFile(path.join(repoPath,key),filecontent.Body);
    
    
    
}
console.log("All commits pulled from b2");

    

    



}
catch(err){
    console.log("Unable to pull :",err);
}

    
}
module.exports={pullRepo}