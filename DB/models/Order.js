import mongoose, { Types } from "mongoose";

const orderSchema= new mongoose.Schema({
    user:{
        type:Types.ObjectId,
        ref:'User',
        required:[true,'user is required'],
    },
    products:[
        {
            product:{
                type:Types.ObjectId,
                ref:'Product',
                required:[true,'product is required']
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true,
                min:0
            }
        }
    ],
    total:{
        type:Number,
        required:true,
        min:0
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    paidAt:Date,
    deliveredAt:Date,
    paymentMethod:{
        type:String,
        enum:['cash','card'],
        default:'cash'
    },
    address:{
        type:String,
        required:true
    },
    phone:String
},{
    timesstamps:true
})

const Order=mongoose.model('Order',orderSchema)
export default Order