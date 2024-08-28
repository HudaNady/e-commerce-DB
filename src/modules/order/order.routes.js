import { Router } from "express";
import * as order from './controller/order.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";


const router=Router()
router.post('/addOrder',authentication,authorization([roles.user]),order.addOrder)


export default router