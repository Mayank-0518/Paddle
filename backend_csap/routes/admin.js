const {Router}=require("express");
const {AdminModel, CourseModel}=require("../db")
const{JWT_SECRET_ADMIN} = require('../config');
const bcrypt=require('bcrypt');
const zod=require('zod');
const jwt=require('jsonwebtoken');
const { adminMiddleware } = require("../middleware/admin");
const multer = require('multer');
const cloudinary=require("../cloudinary")


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



const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

adminRouter.post('/course', adminMiddleware, upload.single("image"), async function(req, res) {
    console.log('\n\n🚀 POST /admin/course - Request received');
    
    
    if (!req.file) {
        return res.status(400).json({ 
            message: "Image is required" 
        });
    }

    // Convert price to number since it comes as string from form data
    const courseData = {
        title: req.body.title,
        description: req.body.description,
        price: Number(req.body.price)
    };

    console.log("Processed Course Data:", courseData);

    // Validate the course data
    const requireBody = zod.object({
        title: zod.string().min(3), 
        description: zod.string().min(10), 
        price: zod.number().positive()
    });

    const parseDataWithSuccess = requireBody.safeParse(courseData);

    if (!parseDataWithSuccess.success) {
        return res.status(400).json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const adminId = req.adminId;
    const { title, description, price } = courseData;
    
    try {
        // Upload image to cloudinary
        const uploadResult = await cloudinary.uploader.upload(
            `data:image/png;base64,${req.file.buffer.toString("base64")}`,
            { folder: "course_images" }
        );
        
        // Create course with uploaded image URL
        const course = await CourseModel.create({
            title,
            description,
            price,
            imageURL: uploadResult.secure_url,
            creatorId: adminId
        });
        
        return res.status(201).json({
            message: "Course created successfully",
            courseId: course._id
        });
    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({
            message: "Error uploading image or creating course",
            error: error.message
        });
    }
});

adminRouter.put('/course', adminMiddleware, upload.single("image"), async function(req, res) {
    const adminId = req.adminId;
    const requiredBody = zod.object({
        courseId: zod.string().min(5),
        title: zod.string().min(3).optional(), 
        description: zod.string().min(5).optional(),
        price: zod.number().positive().optional()
    });

    const courseData = {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : undefined
    };

    const parseDataWithSuccess = requiredBody.safeParse(courseData);
    if (!parseDataWithSuccess.success) {
        return res.status(400).json({
            message: "Incorrect data format",
            error: parseDataWithSuccess.error,
        });
    }

    const { courseId, title, description, price } = courseData;
    const course = await CourseModel.findOne({ _id: courseId, creatorId: adminId });

    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    try {
        let imageURL = course.imageURL; // Keep existing image URL by default
        
        // Only update image if a new one is uploaded
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (course.imageURL) {
                const oldPublicId = course.imageURL.split('/').slice(-1)[0].split('.')[0];
                await cloudinary.uploader.destroy(`course_images/${oldPublicId}`);
            }

            // Upload new image
            const uploadResult = await cloudinary.uploader.upload(
                `data:image/png;base64,${req.file.buffer.toString("base64")}`,
                { folder: "course_images" }
            );
            imageURL = uploadResult.secure_url;
        }

        // Update course with new data
        await CourseModel.updateOne(
            { _id: courseId, creatorId: adminId },
            {
                title: title || course.title,
                description: description || course.description,
                imageURL: imageURL,
                price: price || course.price,
            }
        );

        res.status(200).json({
            message: "Course updated successfully",
            courseId: course._id
        });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            message: "Error updating course",
            error: error.message
        });
    }
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

    try {
        // Extract public_id from the imageURL
        const publicId = course.imageURL.split('/').slice(-1)[0].split('.')[0];
        
        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(`course_images/${publicId}`);
        
        // Delete course from database
        await CourseModel.deleteOne({
            _id: courseId,
            creatorId: adminId,
        });

        res.status(200).json({
            message: "Course and associated image deleted!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting course or image",
            error: error.message
        });
    }
});


module.exports={
    adminRouter:adminRouter
}