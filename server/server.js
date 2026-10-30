const express=require("express");
const cors=require("cors")
const connectDB=require("./model/database");
const projectRoutes=require("./routes/projectRoutes");
const app=express();

require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use("/api/projects", projectRoutes);



app.get("/api/health",(req,res)=>{
    res.status(200).json({success:true,message:"project scope api is runnign"})
})

const startServer= async()=>{
    await connectDB();
app.listen(process.env.PORT||8000,()=>{
    console.log(`server is running ${process.env.PORT}`)
})
};




startServer();

