import User from "../../../../DB/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import bcrybtjs from "bcryptjs";


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    const match = bcrybtjs.compareSync(oldPassword, user.password);
    if (!match) {
        return next(new AppError(" old password not correct", 400));
    }
    await User.updateOne({
        password:bcrybtjs.hashSync(newPassword, 8),
        passwordChanged:new Date()
    },
    {new:true}
)
return res.status(201).json({ message: "done", user });
});








