import User from "../../../../DB/models/User.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import bcrybtjs from "bcryptjs";
import jwt from "jsonwebtoken";


export const signUp = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new AppError("email already exist", 409));
    }
    req.body.password = bcrybtjs.hashSync(password, 8);
    const user = await User.insertMany([req.body]);
    return res.status(201).json({ message: "done", user });
});
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({email});
    if (!userExist) {
        return next(new AppError("invalid email or password", 400));
    } else {
        const match = bcrybtjs.compareSync(password, userExist.password);
        if (!match) {
            return next(new AppError("invalid email or password", 400));
        }
        const token = jwt.sign(
            {
                name:userExist.name,
                userId: userExist._id,
                rol: userExist.rol,
            },
            process.env.KEY
        );
        return res.status(200).json({ message: "done", token });
    }
});








