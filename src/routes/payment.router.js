import { Router } from "express";
import PaymentService from "../services/payments.js";
import Stripe from "stripe";
import dotenv from 'dotenv'
import __dirname from "../dirname.js";
import { CartService } from "../repository/index.js";
import { generatePurchase } from "../controllers/carts.controller.js";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router()

router.post('/create-checkout-session', async (req, res) => {
  const {cid} = req.body;
  try {

    const cartRequested = await CartService.getById(cid) 

    if (!cartRequested) {
      return res.status(404).send({ status: 'error', error: 'Product not found' });
    }

    const totalCart = await CartService.getTotal(cid)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Cart ${cartRequested._id}`,
            },
            unit_amount: totalCart * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:8082/api/payments/success/${cid}`,
      cancel_url: 'http://localhost:8082/api/payments/cancel', 
    });

    res.send({ status: 'success', payload: session });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: 'error', error: 'Failed to create Checkout Session' });
  }
});

router.get('/success/:cid', generatePurchase)

router.get('/cancel', (req, res) => {
    res.render('cancelPayment')
})


export default router