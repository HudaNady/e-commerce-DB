import { Router } from "express";
import * as user from './controller/user.controller.js'
import { authentication, authorization } from "../../middleware/auth.js";
import validation from "../../middleware/validation.js";
import { updatePassword } from "./user.validation.js";


const router=Router()
router.post('/updatePassword',authentication,validation(updatePassword),user.updatePassword)

export default router