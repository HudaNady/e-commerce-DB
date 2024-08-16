import { Router } from "express";
import * as wishList from './controller/wishList.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import roles from "../../types/roles.js";



const router=Router()
router.post('/addWishList',authentication,authorization([roles.user]),wishList.addWishList)
router.get('/getAllWishLists',wishList.getAllWishLists)
router.delete('/delete',authentication,authorization([roles.user]),wishList.deleteWishList)


export default router