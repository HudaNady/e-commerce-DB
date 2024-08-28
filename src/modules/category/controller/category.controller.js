import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Category from "../../../../DB/models/Category.js";
import AppError from "../../../utils/Error.js";
import fs from 'fs'
import path from "path"
import ApiFeatures from "../../../utils/apiFeatures.js";

export const addCategory=asyncHandler(
    async (req, res, next) => {
        const {name}=req.body
        req.body.image=req.file?.filename
        req.body.createdBy=req.user.userId
        req.body.slug= slugify(name)
        const category = await Category.insertMany([req.body]);
        return res.status(201).json({ message: "done", category });
    }
)
export  const getAllCategories=asyncHandler(
    async (req, res, next) => {
        let ApiFeatures =new ApiFeatures(Category.find(),req.query)
        ApiFeatures=ApiFeatures.pagination().sort().fields().search()
        const categories= await ApiFeatures.mongooseQuery
        if(categories.length){
            return res.status(200).json({ message: "done", categories,status:200 });
        }
        return next(new AppError("categories not found", 404));
    }
)
export  const getCategoryById=asyncHandler(
    async (req, res, next) => {
        const category= await Category.findById(req.params._id)
        if(category){
            return res.status(200).json({ message: "done", category,status:200 });
        }
        return next(new AppError("category not found", 404));
    }
)
export  const updateCategory=asyncHandler(
    async (req, res, next) => {
        const {name}=req.body
        req.body.slug= slugify(name)
        req.body.updatedBy=req.user.userId
        const oldCategory = await Category.findById(req.params._id);
        const oldImagePath = oldCategory.image;
        req.body.image=req.file?.filename
        const category= await Category.findByIdAndUpdate(req.params._id,req.body,{new:true})
        ///delete old image in upload folder
        if (oldImagePath && oldImagePath !== req.body.image) {
            const fullOldImagePath = path.join(__dirname, '..', 'uploads','subCategory', oldImagePath);
            fs.access(fullOldImagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(fullOldImagePath)
                } else {
                    console.log('Old image file not found.');
                }
            });
        }
        return (category)?res.status(200).json({ message: "done", category,status:200 })
        :next(new AppError("category not found", 404));
    }
)
export  const deleteCategory=asyncHandler(
    async (req, res, next) => {
        const category= await Category.findByIdAndDelete(req.params._id)
        return (category)?res.status(200).json({ message: "done", category,status:200 })
        :next(new AppError("category not found", 404));
    }
)
