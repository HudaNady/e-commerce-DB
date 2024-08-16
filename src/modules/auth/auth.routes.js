import { Router } from "express";
import * as auth from './controller/auth.controller.js'
import validation from "../../middleware/validation.js";
import { loginSchema, signUpSchema } from "./auth.validation.js";


const router=Router()
router.post('/signUp',validation(signUpSchema),auth.signUp)
router.post('/signIn',validation(loginSchema),auth.login)


export default router