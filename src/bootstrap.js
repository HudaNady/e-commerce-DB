import connected from '../DB/conection.js'
import dotenv from 'dotenv'
import globalError from './middleware/globalError.js'
import category from './modules/category/category.routes.js'
import brand from './modules/brand/brand.routes.js'
import subCategory from './modules/subCategory/subCategory.routes.js'
import product from './modules/product/product.routes.js'
import review from './modules/review/review.routes.js'
import wishList from './modules/wishList/wishList.routes.js'
import cart from './modules/cart/cart.routes.js'
import order from './modules/order/order.routes.js'
import coupon from './modules/coupon/coupon.routes.js'
import address from './modules/address/address.routes.js'
import authRouter from './modules/auth/auth.routes.js'
import userRouter from './modules/user/user.routes.js'
import Stripe from "stripe";
import asyncHandler from './middleware/asyncHandler.js'


const stripe = new Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

function bootstrap(app, express) {
    const baseUrl = '/api/v1'
    process.on('uncaughtException', (err) => {
        console.log(err)
    })
    connected()
    const endpointSecret = 'whsec_L7efZH6QK6U41OKQwFYAhTkJxCgZCNIW';

    app.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(
        (req, res) => {
            let event = req.body;
            if (endpointSecret) {
                const signature = req.headers['stripe-signature'].toString();
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    endpointSecret
                );
            }
            let checkoutSessionCompleted
            // Handle the event
            if (event.type == "checkout.session.completed") {
                checkoutSessionCompleted = event.data.object
            } else {
                console.log(`unhandeled event type ${event.type}`);
            }
            res.status(200).json({ checkoutSessionCompleted })
        }
    ));

    dotenv.config()
    app.use('/uploads', express.static('uploads'))
    app.use(express.json())
    app.use(`${baseUrl}/categories`, category)
    app.use(`${baseUrl}/brands`, brand)
    app.use(`${baseUrl}/subCategories`, subCategory)
    app.use(`${baseUrl}/products`, product)
    app.use(`${baseUrl}/addresses`, address)
    app.use(`${baseUrl}/coupon`, coupon)
    app.use(`${baseUrl}/order`, order)
    app.use(`${baseUrl}/cart`, cart)
    app.use(`${baseUrl}/wishList`, wishList)
    app.use(`${baseUrl}/review`, review)
    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/user`, userRouter)
    app.use('*', (req, res) => {
        return res.json({ message: 'not found' })
    })
    process.on('unhandledRejection', (err) => {
        console.log(err)
    })
    app.use(globalError)
}
export default bootstrap