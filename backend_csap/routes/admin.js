const {Router}=require("express");
const {AdminModel, CourseModel}=require("../db")
const{JWT_SECRET_ADMIN} = require('../config');
const bcrypt=require('bcrypt');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const { adminMiddleware } = require("../middleware/admin");


const adminRouter=Router();


adminRouter.post('/signup',async function(req,res){
    const requiredBody = zod.object({email: zod.string().min(3).max(100).email(), 
        password: zod.string().min(5).max(100).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/), 
        first_name: zod.string().min(3).max(100),
        last_name: zod.string().min(3).max(100)})

        const parseDataWithSuccess = requiredBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }
const {email,password,first_name,last_name}=req.body;
 const hashedPassword = await bcrypt.hash(password, 5);

try{
    await AdminModel.create({
        email:email,
        password:hashedPassword,
        first_name:first_name,
        last_name:last_name
    })
}catch(error){
    return res.json({
        message:"bruhh!"
    })
}

res.json({
    message:"You are signed up"
})
})

adminRouter.post('/signin',async function(req,res){
   
const requiredBody = zod.object({
    email: zod.string().min(3).max(100).email(),
    password: zod.string().min(5).max(100),
});

const parseDataWithSuccess = requiredBody.safeParse(req.body);

if (!parseDataWithSuccess.success) {
    return res.json({
        message: "Incorrect data format",
        error: parseDataWithSuccess.error,
    }); 
}

const email = req.body.email;
const admin = await AdminModel.findOne({ email: email });

if(!admin){
    return res.status(400).json({ message:"Admin doesn't exist" });
}
const passwordMatch = await bcrypt.compare(req.body.password, admin.password);
if(passwordMatch){
    const token=jwt.sign({id:admin._id},JWT_SECRET_ADMIN);  
    return res.json({message:"You are logged in",token:token});
}
else{
    return res.status(403).json({message:"Incorrect password"});
}
})


adminRouter.post('/course',adminMiddleware,async function(req,res){

    const requireBody = zod.object({
        title: zod.string().min(3), 
        description: zod.string().min(10), 
        imageURL: zod.string().url(), 
        price: zod.number().positive(),
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });}
    const adminId=req.adminId;
    const{title,description,price,imageURL}=req.body;
    const course=await CourseModel.create({
        title:title,
        description:description,
        price:price,
        imageURL:imageURL,
        creatorId:adminId
    })
    return res.status(201).json({
        message:"Course created",
        courseId:course._id})

})


adminRouter.put('/course',adminMiddleware,async function(req,res){
  const adminId=req.adminId;
  const requiredBody = zod.object({
    courseId: zod.string().min(5),
    title: zod.string().min(3).optional(), 
    description: zod.string().min(5).optional(),
    imageURL: zod.string().url().min(5).optional(), 
    price: zod.number().positive().optional(), 
  });
    const parseDataWithSuccess = requiredBody.safeParse(req.body);
    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

const {courseId,title,description,imageURL,price}=req.body;
const course=await CourseModel.findOne({_id:courseId,creatorId:adminId});

if(!course){
    return res.json({
        message:"Course not found"
    })}

await CourseModel.updateOne({
    _id:courseId,
    creatorId:adminId},{
        title: title || course.title,
        description: description || course.description,
        imageURL: imageURL || course.imageURL, 
        price: price || course.price,
    })
    res.json({
        message:"Course updated",
        courseId:course._id  })

});
adminRouter.get('/course/bulk',adminMiddleware,async function(req,res){
    const adminId = req.adminId;

    const courses = await CourseModel.find({
        creatorId: adminId,
    });

    res.status(200).json({
        courses: courses,
    });
});
adminRouter.delete("/course", adminMiddleware, async function (req, res) {
    const adminId = req.adminId;

    const requireBody = zod.object({
        courseId: zod.string().min(5), 
    });

    const parseDataWithSuccess = requireBody.safeParse(req.body);

    if (!parseDataWithSuccess.success) {
        return res.json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const { courseId } = req.body;

        const course = await CourseModel.findOne({
        _id: courseId,
        creatorId: adminId,
    });

    if (!course) {
        return res.status(404).json({
            message: "Course not found!",
        });
    }

    await CourseModel.deleteOne({
        _id: courseId,
        creatorId: adminId,
    });

    res.status(200).json({
        message: "Course deleted!",
    });
});


module.exports={
    adminRouter:adminRouter
}