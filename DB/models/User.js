import mongoose, { Types } from "mongoose";
import roles from "../../src/types/roles.js";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        trim:true,
        unique:[true,'name is unique'],
        minLength:[3,'min length is 3 characters'],
        maxLength:[25,'max length is 3 characters']
    },
    email:{
        type:String,
        required:[true,'email is required'],
    },
    password:{
        type:String,
        unique:[true,'name is unique'],
        required:[true,'password is required'],
    },
    passwordChanged:{
        type:Date
    },
    rol:{
        type:String,
        enum:Object.values(roles),
        default:roles.user
    },
    wishList:[{
        type:Types.ObjectId,
        ref:"Product"
    }],
    address:[{
        city:String,
        street:String
    }],
},{
    timesstamps:true
})

const User=mongoose.model('User',userSchema)
export default User