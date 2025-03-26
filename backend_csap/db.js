const {mongoose}=require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema =new Schema(
    {
        
        email:{type:String , unique:true},
        password: String,
        first_name:String,
        last_name:String
    }
)
const AdminSchema =new Schema(
    {
        email:{type:String , unique:true},
        password: String,
        first_name:String,
        last_name:String
    }
)
const CourseSchema=new Schema(
    {
        title: String,
        description: String,
        price: Number,
        imageURL: String,
        creatorId: { type: ObjectId, ref: 'Admin' }
    }
)
const purchaseSchema = new Schema({
    userId: { type: ObjectId, ref: 'User' },
    courseId: { type: ObjectId, ref: 'Course' }
});


const UserModel=mongoose.model('User',UserSchema);
const AdminModel=mongoose.model('Admin',AdminSchema);
const CourseModel=mongoose.model('Course',CourseSchema)
const purchaseModel=mongoose.model('purchase',purchaseSchema);

module.exports={
    UserModel,
    AdminModel,
    CourseModel,
    purchaseModel
    
};