import Cart from "../../../../DB/models/Cart.js";
import Coupon from "../../../../DB/models/Coupon.js";
import Product from "../../../../DB/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";

async function calc(cart){
    const subTotal=cart.products.reduce((prev,element)=>prev+=element.quntity*element.price)
    cart.subTotal=subTotal
    if(!cart.discount){
        cart.total=subTotal
    }
    cart.total=subTotal-(subTotal*cart.discount)/100
    await cart.save()
}
export const addCart=asyncHandler(
    async (req, res, next) => {
        const cartExist= await Cart.findOne({user:req.user.userId})
        if(!cartExist){
            const newCart = await Cart.create({user:req.user.userId});
            const product= await Product.findById(req.body.product)
            if(!product){
                return next(new AppError("product not found ", 404));
            }
            req.body.price=product.priceAfterDiscount
            if(product.stock<req.body.quntity){
                return next(new AppError("out of stock ", 400));
            }
            const addToCart = await Cart.findOneAndUpdate(
                {user:req.user.userId},
                {
                    $push:{products:req.body.product}
                },
                {
                    new:true
                }
            );
            calc(addToCart)
            return res.status(201).json({ message: "done", addToCart,status:201 });
        }
        let productExist=false
        const product= await Product.findById(req.body.product)
            if(!product){
                return next(new AppError("product not found ", 404));
            }
            req.body.price=product.priceAfterDiscount
            if(product.stock<req.body.quntity){
                return next(new AppError("out of stock ", 400));
            }
            cartExist.products.forEach(async(pro)=>{
                if(pro.product==req.body.product){
                    productExist=true
                    if(product.stock<req.body.quntity+pro.quntity){
                        return next(new AppError("out of stock ", 400));
                    }
                    pro.quntity=req.body.quntity+pro.quntity
                    await cartExist.save()
                    calc(cartExist)
                    return res.status(200).json({ message: "done", cartExist,status:200 });
                }
            })
        if(!productExist){
            const addToCart = await Cart.findOneAndUpdate(
                {user:req.user.userId},
                {
                    $push:{products:req.body.product}
                },
                {
                    new:true
                }
            );
            calc(addToCart)
            return res.status(201).json({ message: "done", addToCart,status:201 });
        }
    }
)
export  const applyCoupon=asyncHandler(
        async (req, res, next) => {
            const coupon= await Coupon.findOne({code:req.body.code,expired:{$gte:Date.now()}})
            if(!coupon){
                return next(new AppError("coupon not found", 404));
            }
            const cartExist= await Cart.findOne({user:req.user.userId})
            cartExist.discount=coupon.discount
            await cartExist.save()
            calc(cartExist)
            return res.status(201).json({ message: "done", cartExist,status:201 });
        }
)
export  const getCart=asyncHandler(
    async (req, res, next) => {
        const cart= await Cart.findOne({user:req.user.userId})
        if(cart){
            return res.status(200).json({ message: "done", cart,status:200 });
        }
        return next(new AppError("cart not found", 404));
    }
)
export  const deleteProduct=asyncHandler(
    async (req, res, next) => {
        const cart = await Cart.findOneAndDelete(
            {user:req.user.userId},
            {
                $pull:{products:{_id:req.params._id}}
            },
            {
                new:true
            }
        );
        if(!cart){
            next(new AppError("cart not found", 404))
        }
        calc(cart)
        return res.status(200).json({ message: "done", cart ,status:200 })
    }
)
export  const updateProductQuantity=asyncHandler(
    async (req, res, next) => {
        const cart= await Cart.findOne({user:req.user.userId})
        if(!cart){
            return next(new AppError("cart not found", 404));
        }
        let productExist=false
        cart.products.forEach(async(pro)=>{
            if(pro.product==req.params._id){
                productExist=true
                pro.quntity=req.body.quntity
                await cart.save()
                calc(cart)
                return res.status(200).json({ message: "done", cart,status:200 });
            }
        })
        if(!productExist){
            return next(new AppError("product not found in cart", 404));

        }
    }
)
export  const deleteCart=asyncHandler(
    async (req, res, next) => {
        const cart= await Cart.findById(req.params._id)
        if(!cart){
            return next(new AppError("Review not found", 404));
        }
        Cart.deleteOne(req.params._id)
        return res.status(200).json({ message: "done", cart,status:200 })
    }
)
