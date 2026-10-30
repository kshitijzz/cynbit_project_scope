const mongoose=require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        clientName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        },
        projectType:{
            type:String,
            required:true,
              enum: [
                "business-website",
                "ecommerce",
                "web-application",
                "mobile-app"
            ]
        },
        features:{
            type:[String],
            default: []
        },
        estimatedDays:{
            type:Number,
            required:true,
            min:1
        },
        budgetRange:{
            type:String,
            required:true
        },
        description:{
            type:String,
            trim:true,
            maxlength:2000,
            default:""
        }
    },
    {timestamps:true}
);

module.exports=mongoose.model("Project",projectSchema);