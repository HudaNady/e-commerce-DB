
import { Router } from "express";
import * as address from './controller/address.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";



const router=Router()
router.post('/addAddress',authentication,authorization([roles.user]),address.addAddress)
router.get('/getAllAddresss',address.getAllAddresss)
router.delete('/delete/:_id',authentication,authorization([roles.user]),address.deleteAddress)


export default router