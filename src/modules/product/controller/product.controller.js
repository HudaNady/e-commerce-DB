import slugify from "slugify";
import asyncHandler from "../../../middleware/asyncHandler.js";
import Product from "../../../../DB/models/Product.js";
import AppError from "../../../utils/Error.js";
import fs from 'fs'
import path from "path"
import ApiFeatures from "../../../utils/apiFeatures.js";

export const addProduct = asyncHandler(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.title)
        req.body.createdBy=req.user.userId
        req.body.mainImage = req?.files?.mainImage[0].filename
        req.body.coverImage = req?.files?.coverImage?.map(ele => ele.filename)
        const product = await Product.insertMany([req.body]);
        return res.status(201).json({ message: "done", product });
    }
)
export const getAllProducts = asyncHandler(
    async (req, res, next) => {
        let ApiFeatures =new ApiFeatures(Product.find(),req.query)
        ApiFeatures=ApiFeatures.pagination().sort().fields().search()
        const products = await ApiFeatures.mongooseQuery.populate([
            {
                path: 'category'
            },
            {
                path: 'subCategory'
            },
            {
                path: 'brand'
            },
        ])
        
        if (products.length) {
            return res.status(200).json({ message: "done", products, status: 200 });
        }
        return next(new AppError("products not found", 404));
    }
)
export const getProductById = asyncHandler(
    async (req, res, next) => {
        const product = await Product.findById(req.params._id).populate([
            {
                path: 'category'
            },
            {
                path: 'subCategory'
            },
            {
                path: 'brand'
            },
        ])
        if (product) {
            return res.status(200).json({ message: "done", product, status: 200 });
        }
        return next(new AppError("product not found", 404));
    }
)
export const deleteProduct = asyncHandler(
    async (req, res, next) => {
        const product = await Product.findByIdAndDelete(req.params._id)
        return (product) ? res.status(200).json({ message: "done", product, status: 200 })
            : next(new AppError("product not found", 404));
    }
)

export const updateProduct = asyncHandler(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.title)
        req.body.updatedBy=req.user.userId
        const oldProduct = await Product.findById(req.params._id);
        if (req.files?.mainImage) {
            req.body.mainImage = req.files?.mainImage[0]?.filename
        }
        if (oldProduct.mainImage && oldProduct.mainImage !== req.body.mainImage) {
            await deleteImageFile(oldProduct.mainImage);
        }
        req.body.coverImage = req.files?.coverImage?.map(ele => ele.filename)
        if (oldProduct.coverImage.length > 0) {
            const oldCoverImagePaths = oldProduct.coverImage.filter(
                (img) => !req.body.coverImage.includes(img)
            );
            await Promise.all(oldCoverImagePaths.map(deleteImageFile));
        }
        const product = await Product.findByIdAndUpdate(req.params._id, req.body, { new: true })
        return (product) ? res.status(200).json({ message: "done", product, status: 200 })
            : next(new AppError("product not found", 404));
    }
)


async function deleteImageFile(imagePath) {
    const fullImagePath = path.join(
        __dirname,
        '..',
        'uploads',
        'product',
        imagePath
    );

    return new Promise((resolve, reject) => {
        fs.access(fullImagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.log(`Image file not found: ${fullImagePath}`);
                resolve();
            } else {
                fs.unlink(fullImagePath);
            }
        });
    });
}