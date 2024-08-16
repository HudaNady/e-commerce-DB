import  joi from "joi" 

export const addProductSchema=joi.object({
    name: joi.string().min(3).max(25).trim().required(),
    description:joi.string().min(3).max(1500).trim().required(),
    price:joi.number().min(0).required(),
    priceAfterDiscount:joi.number().min(0),
    stock:joi.number().min(0).required(),
    sold:joi.number().min(0),
    rateCount:joi.number().min(0),
    rateAvrage:joi.number().min(0),
    files:joi.object({
        image:joi.array().items(
            joi.object({
                size:joi.number().positive().required(),
                path:joi.string().required(),
                filename:joi.string().required(),
                destination:joi.string().required(),
                minetype:joi.string().required(),
                encoding:joi.string().required(),
                fieldname:joi.string().required()
            })
        )
    })

})