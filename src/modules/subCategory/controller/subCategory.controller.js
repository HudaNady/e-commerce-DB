import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import SubCategory from "../../../../DB/models/SubCategory.js";
import AppError from "../../../utils/Error.js";
import fs from 'fs'
import path from "path"
import ApiFeatures from "../../../utils/apiFeatures.js";

export const addSubCategory = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        req.body.slug = slugify(name)
        req.body.createdBy=req.user.userId
        req.body.image = req.file?.filename
        const subCategory = await SubCategory.insertMany([req.body]);
        return res.status(201).json({ message: "done", subCategory });
    }
)
export const getAllSubCategories = asyncHandler(
    async (req, res, next) => {
        let ApiFeatures =new ApiFeatures(SubCategory.find({ category: req.params._id }),req.query)
        ApiFeatures=ApiFeatures.pagination().sort().fields().search()
        const subCategories= await ApiFeatures.mongooseQuery.populate('category')
        if (subCategories.length) {
            return res.status(200).json({ message: "done", subCategories, status: 200 });
        }
        return next(new AppError("subCategories not found", 404));
    }
)
export const getSubCategoryById = asyncHandler(
    async (req, res, next) => {
        const subCategory = await SubCategory.findById(req.params._id).populate('category')
        if (subCategory) {
            return res.status(200).json({ message: "done", subCategory, status: 200 });
        }
        return next(new AppError("SubCategory not found", 404));
    }
)
export const updateSubCategory = asyncHandler(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.name)
        req.body.updatedBy=req.user.userId
        const oldSubCategory = await SubCategory.findById(req.params._id);
        const oldImagePath = oldSubCategory.image;
        req.body.image = req.file?.filename
        const subCategory = await SubCategory.findByIdAndUpdate(req.params._id, req.body, { new: true })
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
        return (subCategory) ? res.status(200).json({ message: "done", subCategory, status: 200 })
            : next(new AppError("SubCategory not found", 404));
    }
)
export const deleteSubCategory = asyncHandler(
    async (req, res, next) => {
        const subCategory = await SubCategory.findByIdAndDelete(req.params._id)
        return (subCategory) ? res.status(200).json({ message: "done", subCategory, status: 200 })
            : next(new AppError("SubCategory not found", 404));
    }
)
