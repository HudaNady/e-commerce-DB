import { Router } from "express";
import * as coupon from './controller/coupon.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/addCoupon',authentication,authorization([roles.admin]),coupon.addCoupon)
router.get('/getAllCoupons',coupon.getAllCoupons)
router.put('/:_id',authentication,authorization([roles.admin]),coupon.updateCoupon)
router.delete('/:_id',authentication,authorization([roles.admin]),coupon.deleteCoupon)

export default router