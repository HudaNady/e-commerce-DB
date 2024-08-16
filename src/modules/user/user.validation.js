import joi from 'joi'

export const updatePassword=joi.object({
    Newpassword:joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).message('password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters ').required()
})