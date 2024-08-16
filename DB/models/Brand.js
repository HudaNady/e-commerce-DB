import mongoose, { Types } from "mongoose";

const brandSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        unique:[true,'name is unique'],
        minLength:[3,'min length is 3 characters'],
        maxLength:[25,'max length is 3 characters']
    },
    slug:{
        type:String,
        required:[true,'slug is required'],
        lowerCase:true
    },
    image:String,
    createdBy:{
        type:Types.ObjectId,
        // ref:'User',
        // required:[true,'createdBy is required']
    },
    updatedBy:{
        type:Types.ObjectId,
        // ref:'User',
    }
},{
    timesstamps:true
})
brandSchema.post('init',(doc)=>{
    if(doc.image){
        doc.image='http://localhost:3000/uploads/brand/' + doc.image
    }
})

const Brand=mongoose.model('Brand',brandSchema)
export default Brand