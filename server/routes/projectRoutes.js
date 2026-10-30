const express=require("express");

const router=express.Router();

const estimateProject=require("../utils/estimateProject");
const Project = require("../model/Project");


router.post("/estimate",(req,res)=>{
    try{
        const{projectType,features}=req.body;
        const estimate=estimateProject(projectType,features);

        res.status(200).json({
            success:true,estimate
        });
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
});

router.post("/",async (req,res)=>{
    try{
        const{
            clientName,
            email,
            projectType,
            features,
            description
        }=req.body;
        if(
            typeof clientName !=="string" || !clientName.trim()|| typeof email !=="string"|| !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ){
            return res.status(400).json({
                success:false,
                message:"A valid name and email are required"
            })
        }
        if(typeof description !=="string" || description.length>2000){
            return res.status(400).json({
                success:false,
                message:"Description must be 2000 characters or fewer"
            })
        }

        const estimate=estimateProject(projectType,features);
        const project=await Project.create({
            clientName:clientName.trim(),
            email:email.trim(),
            projectType,
            features:estimate.features,
            estimatedDays:estimate.estimatedDays,
            budgetRange:estimate.budgetRange,
            description:description.trim()
        });
        res.status(201).json({
            success:true,
            message:"Project brief submitted successfully",
            project
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
});

module.exports=router;