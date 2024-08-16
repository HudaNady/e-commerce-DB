import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import User from "../../../../DB/models/User.js";

export const addWishList=asyncHandler(
    async (req, res, next) => {
        const wishList = await User.findByIdAndUpdate(req.user.userId,
            {
                $addToSet:{wishList:req.body.product}
            },
            {
                new:true
            }
        );
        return res.status(201).json({ message: "done", wishList});
    }
)
export  const getAllWishLists=asyncHandler(
    async (req, res, next) => {
        const wishList= await User.find()
        if(wishList.length){
            return res.status(200).json({ message: "done", wishList,status:200 });
        }
        return next(new AppError("wishList not found", 404));
    }
)
export  const deleteWishList=asyncHandler(
    async (req, res, next) => {
        const wishList = await User.findByIdAndDelete(req.user.userId,
            {
                $pull:{wishList:req.body.product}
            },
            {
                new:true
            }
        );
        return res.status(200).json({ message: "done", wishList});
    }
    
)
