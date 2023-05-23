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
  const {cid} = req.body; // Obtén el ID del carrito desde req.body o cualquier otra fuente
  console.log(cid);

  try {
    // Obtén la información del carrito utilizando el ID del carrito
    const cartRequested = await CartService.getById(cid) // Reemplaza 'getCartById' con la lógica real para obtener la información del carrito

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
              name: `Cart ${cartRequested._id}`, // Reemplaza con el nombre real del producto
            },
            unit_amount: totalCart * 100, // El precio debe estar en centavos
          },
          quantity: 1, // Puedes ajustar la cantidad según tus necesidades
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:8082/api/payments/success/${cid}`, // URL de éxito a la que se redirige después del pago
      cancel_url: 'http://localhost:8082/api/payments/cancel', // URL de cancelación a la que se redirige si se cancela el pago
    });

    console.log(session);
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