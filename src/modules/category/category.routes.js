import { Router } from "express";
import subCategoriesRouter from '../subCategory/subCategory.routes.js'
import * as category from './controller/category.controller.js'
import upload, { customValdation } from "../../middleware/multer.js";
import validation from "../../middleware/validation.js";
import { addCategorySchema } from "./category.validation.js";


const router=Router()

router.post('/addCategory',upload(customValdation.images,'category').single('image'),validation(addCategorySchema),category.addCategory)
router.get('/getAllCategory',category.getAllCategories)
router.get('/:_id',category.getCategoryById)
router.put('/:_id',upload(customValdation.images,'category').single('image'),category.updateCategory)
router.delete('/:_id',category.deleteCategory)
.use('/:_id/subCategories',subCategoriesRouter)

export default router