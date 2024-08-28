import Cart from "../../../../DB/models/Cart.js";
import Order from "../../../../DB/models/Order.js";
import Product from "../../../../DB/models/Product.js";
import asyncHandler from "../../../middleware/asyncHandler.js";
import AppError from "../../../utils/Error.js";
import Stripe from "stripe";


const stripe =new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
export const addOrder=asyncHandler(
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
            if(product.stock<ele.quantity){
                return next(new AppError(`out of stock ${ele.product},valid in ${product.stock} `, 400));
            }
        })
        cart.products.forEach(async(ele)=>{
        await Product.findByIdAndUpdate(ele.product,{
            $inc:{sold:ele.quantity,stock:-ele.quantity}
        })
        })
        req.body.products=cart.products
        req.body.total=cart.total
        req.body.user=req.user.userId
        const order=new Order(req.body)
        const newOrder=order.save()
        await Cart.findOneAndDelete({user:req.user.userId})

        if(req.body.paymentMethod=="card"){
            const YOUR_DOMAIN = 'http://localhost:4242';
            const session = await stripe.checkout.sessions.create({
                line_items: [
                {
                    price_data: {
                        currency:"egp",
                        unit_amount:(await newOrder).total*100,
                        product_data:{
                            name:"total price"
                        }
                    },
                    quantity: 1,
                },
                ],
                mode: 'payment',
                success_url: `${YOUR_DOMAIN}?success=true`,
                cancel_url: `${YOUR_DOMAIN}?canceled=true`,
                client_reference_id:req.user.userId,
                // metadata:{
                //     order_id:(await newOrder)._id
                //     }
            });
            return res.status(200).json( {session});
        }
        return res.status(201).json({ message: "done",newOrder ,status:201 });
    }
)

