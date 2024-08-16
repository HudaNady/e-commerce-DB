import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import Coupon from "../../../../DB/models/Coupon.js";


export const addCoupon=asyncHandler(
    async (req, res, next) => {
        const couponExist= await Coupon.findOne({code:req.body.code})
        if(couponExist){
            return next(new AppError("coupon already found", 409));
        }
        const coupon = await Coupon.create(req.body);
        return res.status(201).json({ message: "done", coupon });
    }
)
export  const getAllCoupons=asyncHandler(
    async (req, res, next) => {
        const coupon= await Coupon.find()
        if(coupon.length){
            return res.status(200).json({ message: "done", coupon,status:200 });
        }
        return next(new AppError("coupon not found", 404));
    }
)
export  const updateCoupon=asyncHandler(
    async (req, res, next) => {
        const coupon= await Coupon.findById(req.params._id)
        if(!coupon){
            return next(new AppError("coupon not found", 404));
        }
            coupon= await Coupon.updateOne(req.params._id,req.body,{new:true})
            return res.status(200).json({ message: "done", coupon,status:200 })
        
    }
)
export  const deleteCoupon=asyncHandler(
    async (req, res, next) => {
        const coupon= await Coupon.findById(req.params._id)
        if(!coupon){
            return next(new AppError("Review not found", 404));
        }
            coupon= await Coupon.deleteOne(req.params._id)
            return res.status(200).json({ message: "done", coupon,status:200 })
    }
)
