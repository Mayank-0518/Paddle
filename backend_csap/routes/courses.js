const {Router}=require("express");

const {CourseModel, purchaseModel}=require('../db');
const { userMiddleware } = require("../middleware/user");
const courseRouter=Router();


courseRouter.post('/purchase',userMiddleware,async function(req,res){
   const userId=req.userId;
   const courseId=req.body.courseId;

   if (!courseId) {
    return res.status(400).json({
        message: "Please provide a courseId", 
    });
   }

   // Verify course exists
   const course = await CourseModel.findById(courseId);
   if (!course) {
       return res.status(404).json({
           message: "Course not found"
       });
   }

   const existingPurchase = await purchaseModel.findOne({
       courseId: courseId,
       userId: userId,
   });
   
   if(existingPurchase){
       return res.status(403).json({
           message: "You have already purchased this course"
       });
   }

   try {
       await purchaseModel.create({
           courseId: courseId, 
           userId: userId,     
       });

       res.status(200).json({
           message: "Course purchased successfully",
       });
   } catch (error) {
       res.status(500).json({
           message: "Error purchasing course",
           error: error.message
       });
   }
});

courseRouter.get('/preview',async function(req,res){
   const courses=await CourseModel.find({});
   res.json({
       courses:courses
   })
})


module.exports={
    courseRouter:courseRouter
}