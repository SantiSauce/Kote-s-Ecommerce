import { Router } from "express";
import Stripe from "stripe";
import dotenv from 'dotenv'
import __dirname from "../dirname.js";
import { CartService } from "../repository/index.js";
import { generatePurchase } from "../controllers/carts.controller.js";
import { afterPayment, completePayment } from "../controllers/payment.controller.js";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router()

router.post('/create-checkout-session', completePayment);

router.get('/success/:cid', afterPayment)

router.get('/cancel', (req, res) => {
    res.render('cancelPayment')
})


export default router