import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Brand from "../../../../DB/models/Brand.js";
import AppError from "../../../utils/Error.js";
import fs from 'fs'
import path from "path"
import ApiFeatures from "../../../utils/apiFeatures.js";

export const addBrand=asyncHandler(
    async (req, res, next) => {
        const {name}=req.body
        req.body.image=req.file?.filename
        req.body.createdBy=req.user.userId
        req.body.slug= slugify(name)
        const brand = await Brand.insertMany([req.body]);
        return res.status(201).json({ message: "done", brand });
    }
)
export  const getAllBrands=asyncHandler(
    async (req, res, next) => {
        let ApiFeatures =new ApiFeatures(Brand.find(),req.query)
        ApiFeatures=ApiFeatures.pagination().sort().fields().search()
        const brands= await ApiFeatures.mongooseQuery
        if(brands.length){
            return res.status(200).json({ message: "done", brands,status:200 });
        }
        return next(new AppError("brands not found", 404));
    }
)
export  const getBrandById=asyncHandler(
    async (req, res, next) => {
        const brand= await Brand.findById(req.params._id)
        if(brand){
            return res.status(200).json({ message: "done", brand,status:200 });
        }
        return next(new AppError("brand not found", 404));
    }
)
export  const updateBrand=asyncHandler(
    async (req, res, next) => {
        const {name}=req.body
        req.body.slug= slugify(name)
        req.body.updatedBy=req.user.userId
        const oldBrand = await Brand.findById(req.params._id);
        const oldImagePath = oldBrand.image;
        req.body.image=req.file?.filename
        const brand= await Brand.findByIdAndUpdate(req.params._id,req.body,{new:true})
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
        return (brand)?res.status(200).json({ message: "done", brand,status:200 })
        :next(new AppError("brand not found", 404));
    }
)
export  const deleteBrand=asyncHandler(
    async (req, res, next) => {
        const brand= await Brand.findByIdAndDelete(req.params._id)
        return (brand)?res.status(200).json({ message: "done", brand,status:200 })
        :next(new AppError("brand not found", 404));
    }
)
