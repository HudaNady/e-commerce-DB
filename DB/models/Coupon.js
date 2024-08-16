import mongoose, { Types } from "mongoose";

const couponSchema= new mongoose.Schema({
    code:{
        type:String,
        required:[true,'code is required'],
        trim:true,
    },
    expired:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
},{
    timesstamps:true
})

const Coupon=mongoose.model('Coupon',couponSchema)
export default Coupon