import Cart from "../../../../DB/models/Cart.js";
import Order from "../../../../DB/models/Order.js";
import Product from "../../../../DB/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";



export const addCashOrder=asyncHandler(
    async (req, res, next) => {
        const cart= await Cart.findOne({user:req.user.userId})
        if(!cart){
            return next(new AppError("cart not found", 404));
        }
        if(!cart.products.length){
            return next(new AppError("cart is empty", 400));
        }
        cart.products.forEach(async(ele)=>{
            const product= await Product.findById(ele.product)
            if(!product){
                return next(new AppError(`not found product by ${ele.product} `, 404));
            }
            if(product.stock<ele.quntity){
                return next(new AppError(`out of stock ${ele.product},valid in ${product.stock} `, 400));
            }
        })
        cart.products.forEach(async(ele)=>{
        await Product.findByIdAndUpdate(ele.product,{
            $inc:{sold:ele.quntity,stock:-ele.quntity}
        })
        })
        req.body.products=cart.products
        req.body.total=cart.total
        req.body.user=req.user.userId
        const order=new Order(req.body)
        const newOrder=order.save()
        await Cart.findOneAndDelete({user:req.user.userId})
        return res.status(201).json({ message: "done",newOrder ,status:201 });
    }
)

