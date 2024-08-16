import  joi from "joi" 

export const addSubCategorySchema=joi.object({
    name: joi.string().min(3).max(25).trim().required(),
    category: joi.string().hex().min(24).max(24).trim().required(),
    file: joi.object({
        size:joi.number().positive().required(),
        path:joi.string().required(),
        filename:joi.string().required(),
        destination:joi.string().required(),
        minetype:joi.string().required(),
        encoding:joi.string().required(),
        fieldname:joi.string().required()
    })
})