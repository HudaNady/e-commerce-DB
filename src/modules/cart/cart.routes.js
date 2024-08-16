import { Router } from "express";
import * as cart from './controller/cart.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/addaCart',authentication,authorization([roles.user]),cart.addCart)
router.post('/applyCoupon',authentication,authorization([roles.user]),cart.applyCoupon)
router.get('/getCart',authentication,authorization([roles.user]),cart.getCart)
router.put('/deleteProduct/:_id',authentication,authorization([roles.user]),cart.deleteProduct)
router.put('/updateProductQuantity/:_id',authentication,authorization([roles.user]),cart.updateProductQuantity)
router.delete('/:_id',authentication,authorization([roles.user]),cart.deleteCart)

export default router