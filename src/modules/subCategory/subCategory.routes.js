import { Router } from "express";
import * as subCategory from './controller/subCategory.controller.js'
import validation from "../../middleware/validation.js";
import { addSubCategorySchema } from "./subCategory.validation.js";
import upload, { customValdation } from "../../middleware/multer.js";
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router({mergeParams:true})
router.post('/addSubCategory',upload(customValdation.images,'subCategory').single('image'),validation(addSubCategorySchema),authentication,authorization([roles.admin]),subCategory.addSubCategory)
router.get('/getAllSubCategory',subCategory.getAllSubCategories)
router.get('/:_id',subCategory.getSubCategoryById)
router.put('/:_id',upload(customValdation.images,'subCategory').single('image'),authentication,authorization([roles.admin]),subCategory.updateSubCategory)
router.delete('/:_id',authentication,authorization([roles.admin]),subCategory.deleteSubCategory)


export default router