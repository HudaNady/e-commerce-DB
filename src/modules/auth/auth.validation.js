import joi from 'joi'
import roles from '../../types/roles.js'

export const signUpSchema=joi.object({
    name:joi.string().lowercase().min(3).max(15).trim().message({message:'Last name is required and must be a string'}).required(),
    email:joi.string().email().messages({message:'Email is required and must be a valid email address'}).required(),
    password:joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).message('password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters ').required(),
    rol:joi.string().valid(roles.user, roles.admin).messages({message:'Role is required and must beone of: user, company_HR'}).required()
})
export const loginSchema=joi.object({
  email:joi.string().email().messages({message:'Email is required and must be a valid email address'}).required(),
    password:joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).message('password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters ').required()
})