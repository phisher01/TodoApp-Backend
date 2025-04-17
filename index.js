const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const express=require("express");
const Issue=require("./models/issueModel")
const http=require("http");
const {Server} =require("socket.io");


const yargs = require("yargs");

const {hideBin} = require("yargs/helpers");              // utility to read  arguments in a command
const {initRepo}=require("./controllers/init");
const {addRepo}=require("./controllers/add");
const {commitRepo}=require("./controllers/commit");
const {pushRepo}=require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const {revertRepo}=require("./controllers/revert");
dotenv.config();
const mainRouter = require("./routes/main.router");



console.log(process.env.MONGODB_URI);

yargs(hideBin(process.argv))
.command("start","Start a new server ",{},startServer)
.command("init","Initialise a new repository ",{},initRepo)
.command("add <file>","Add  file to repository ",(yargs)=>{
    yargs.positional("file",{
        describe:"File to add to  the staging area",
        type:"string",
    }
    );
},(argv)=>{
   
    addRepo(argv.file);
})

.command("commit <message>","Commit the staged files",(yargs)=>{
    yargs.positional("message",{describe:"Commit message",type:"string"});

},(argv)=>{commitRepo(argv.message)})
.command("push","Push Commits to B2",{},pushRepo)
.command("pull","Pull Commits from B2",{},pullRepo)

.command("revert <commitID>","Revert to a specific commit",(yargs)=>{
    yargs.positional("commitID",{describe:"Commit id to revert to",type:"string"});

},(argv)=>{revertRepo(argv.commitID)})
.demandCommand(1,"atleast one command is needed").help().argv; 


function startServer(){
    


    const app=express();
const Port=process.env.PORT||3000;
app.use(express.json());
const mongoURI=process.env.MONGODB_URI;
 mongoose.connect(mongoURI)
    .then(()=>{console.log("MongoDB connected! ");})
    .catch((err)=>{console.error("Unable to connect!",err);});


app.use(cors({origin:"*"}));
app.use("/",mainRouter);
app.use("/wrong",(req,res)=>{
    asv=avs;
});

const httpServer=http.createServer(app);
const wss=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"],

    }

});
wss.on("connection",(socket)=>{

    socket.on("JoinRoom",(data)=>{
        console.log(data);



    })

})

const db=mongoose.connection;
db.once("open",()=>{
    console.log("CRUD Opertaion called");
});

httpServer.listen(Port,()=>{
console.log(`Server is running on port${Port}`);
});







}



