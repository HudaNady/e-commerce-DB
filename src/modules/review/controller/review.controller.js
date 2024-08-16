import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Review from "../../../../DB/models/Review.js";
import AppError from "../../../utils/Error.js";
import roles from "../../../types/roles.js";


export const addReview=asyncHandler(
    async (req, res, next) => {
        req.body.user=req.user.userId
        const reviewExist= await Review.findOne({user:req.user.userId,product:req.body.product})
        if(reviewExist){
            return next(new AppError("you already review this product", 409));
        }
        const review = await Review.create(req.body);
        return res.status(201).json({ message: "done", review });
    }
)
export  const getAllReviews=asyncHandler(
    async (req, res, next) => {
        const reviews= await Review.find().populate('user')
        if(reviews.length){
            return res.status(200).json({ message: "done", reviews,status:200 });
        }
        return next(new AppError("Reviews not found", 404));
    }
)
export  const getReviewById=asyncHandler(
    async (req, res, next) => {
        const review= await Review.findById(req.params._id)
        if(review){
            return res.status(200).json({ message: "done", review,status:200 });
        }
        return next(new AppError("Review not found", 404));
    }
)
export  const updateReview=asyncHandler(
    async (req, res, next) => {
        const review= await Review.findById(req.params._id)
        if(!review){
            return next(new AppError("Review not found", 404));
        }
        if(review.user==req.user.userId || req.user.rol==roles.admin){
            review= await Review.updateOne(req.params._id,req.body,{new:true})
            return res.status(200).json({ message: "done", review,status:200 })
        }
        return next(new AppError("forbidden", 404));
    }
)
export  const deleteReview=asyncHandler(
    async (req, res, next) => {
        const review= await Review.findById(req.params._id)
        if(!review){
            return next(new AppError("Review not found", 404));
        }
        if(review.user==req.user.userId || req.user.rol==roles.admin){
            review= await Review.deleteOne(req.params._id)
            return res.status(200).json({ message: "done", review,status:200 })
        }
        return next(new AppError("forbidden", 404));
    }
)
