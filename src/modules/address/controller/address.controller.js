import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import User from "../../../../DB/models/User.js";

export const addAddress=asyncHandler(
    async (req, res, next) => {
        const address = await User.findByIdAndUpdate(req.user.userId,
            {
                $push:{address:req.body.addAddress}
            },
            {
                new:true
            }
        );
        return res.status(200).json({ message: "done", address});
    }
)
export  const getAllAddresss=asyncHandler(
    async (req, res, next) => {
        const address= await User.find()
        if(address.length){
            return res.status(200).json({ message: "done", address,status:200 });
        }
        return next(new AppError("address not found", 404));
    }
)
export  const deleteAddress=asyncHandler(
    async (req, res, next) => {
        const address = await User.findByIdAndDelete(req.user.userId,
            {
                $pull:{address:{_id:req.params._id}}
            },
            {
                new:true
            }
        );
        return !addAddress? 
        next(new AppError("address not found", 404))
        :res.status(200).json({ message: "done", address})
    }
    
)
