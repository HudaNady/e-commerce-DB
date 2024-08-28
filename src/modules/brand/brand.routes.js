import { Router } from "express";
import * as brand from './controller/brand.controller.js'
import validation from "../../middleware/validation.js";
import { addBrandSchema } from "./brand.validation.js";
import upload, { customValdation } from "../../middleware/multer.js";
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/addBrand',upload(customValdation.images,'brand').single('image'),authentication,authorization([roles.admin]),brand.addBrand)
router.get('/getAllBrand',brand.getAllBrands)
router.get('/:_id',brand.getBrandById)
router.put('/:_id',upload(customValdation.images,'brand').single('image'),authentication,authorization([roles.admin]),brand.updateBrand)
router.delete('/:_id',authentication,authorization([roles.admin]),brand.deleteBrand)


export default router