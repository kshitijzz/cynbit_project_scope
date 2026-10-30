const projectTypes={
    "business-website":{label:"Business Website",baseDays: 3},
    ecommerce:{label:"E-commerce Website",baseDays:7},
    "web-application":{label:"Web Application",baseDays:8},
    "mobile-app":{label:"Mobile App",baseDays: 10}
};

const featureDays={
    authentication:3,
    payments:4,
    adminDashboard:5,
    integrations:3,
    searchFilters:2,
    notifications: 2
};

function estimateProject(projectType,features=[]){
     const project= projectTypes[projectType];

     if(!project){
        throw new Error("Invalid project type");
     }
     if(!Array.isArray(features)){
        throw new Error("features must be an array");
     }

     const uniqueFeatures=[...new Set(features)];
     
     const InvalidFeatures=uniqueFeatures.filter(
        feature=>!Object.hasOwn(featureDays,feature)
     );

     if(InvalidFeatures.length >0){
        throw new Error("One or more selected features are invalid");
     }

     const featureTotal=uniqueFeatures.reduce(
        (total,feature)=>total +featureDays[feature],
        0
     )

     const developmentDays=project.baseDays + featureTotal;
     const estimatedDays= Math.ceil(developmentDays*1.2);

     let budgetRange;

     if(estimatedDays <=7){
        budgetRange = "small scope";
     }
     else if(estimatedDays <=15){
        budgetRange="medium scope";
     }
     else{
        budgetRange="large scope";
     }

     return {
        projectType,
        projectName:project.label,
        features:uniqueFeatures,
        estimatedDays,
        budgetRange,
        assumptions:"Illustrative working days, including a 20% buffer. Actual timelines depend on requirements and review cycles."
     }
};
module.exports = estimateProject;