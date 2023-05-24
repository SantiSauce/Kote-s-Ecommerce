import Stripe from "stripe";
import dotenv from "dotenv";
import __dirname from "../dirname.js";
import { CartService } from "../repository/index.js";
import { ProductService } from "../repository/index.js";
import { UserService } from "../repository/index.js";
import { TicketService } from "../repository/index.js";
import { isTokenProcessed } from "../utils/utils.js";
import { markTokenAsProcessed } from "../utils/utils.js";
import { generateToken } from "../utils/utils.js";
import { generateRandomString } from "../public/js/generateRandomString.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const completePayment = async (req, res, next) => {
  const user = req.user.data;
  const { cid } = req.body;
  try {
    const cartRequested = await CartService.getById(cid);

    if (!cartRequested) {
      return res
        .status(404)
        .send({ status: "error", error: "Product not found" });
    }

    const totalCart = await CartService.getTotal(cid);

    const token = generateToken(user);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Cart ${cartRequested._id}`,
            },
            unit_amount: totalCart * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:8082/api/payments/success/${cid}?token=${token}`, //cambiar si usas localhost: o railway(https://kote-s-ecommerce-production.up.railway.app)
      cancel_url: "http://localhost:8082/api/payments/cancel",
    });

    // try {
    //   const user = await UserService.getUserByCartId(cid);

    //   const productChecks = await Promise.all(
    //     cartRequested.products.map(async (product) => {
    //       await Promise.all([
    //         CartService.deleteProduct(cid, product.product),
    //         ProductService.decreaseStock(product.product, product.quantity),
    //       ]);
    //       return subtotal;
    //     })
    //   );

    //   const ticketCreated = await TicketService.create(
    //     {
    //         code: generateRandomString(),
    //         purchase_datetime: new Date(),
    //         amount: totalCart,
    //         purchaser: user.email,
    //       }
    //   )
    //   req.logger.info("Generated Ticket: ", ticketCreated);

    //   const purchasedProductsComplete = await Promise.all(
    //     cartRequested.products.map(async (e) => {
    //       const product = await ProductService.getById(e.product);
    //       return product;
    //     })
    //   );

    // } catch (error) {
    //   req.logger.error(error);
    // }

    res.send({ status: "success", payload: session });
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", error: "Failed to create Checkout Session" });
  }
};

export const afterPayment = async (req, res, next) => {
  const paymentToken = req.query.token;
  const cid = req.params.cid;
  const cart = await CartService.getById(cid);
  const user = await UserService.getUserByCartId(cid);
  const totalCart = await CartService.getTotal(cid);
  const processedToken = isTokenProcessed(paymentToken)
  if (processedToken === false) {
    const ticket = await TicketService.getlast(user.email)
    res.render("successPayment", ticket);
  } else {
    try {
      await Promise.all(
        cart.products.map(async (product) => {
          await Promise.all([
            CartService.deleteProduct(cid, product.product),
            ProductService.decreaseStock(product.product, product.quantity),
          ]);
        })
      );
      const purchasedProductsComplete = await Promise.all(
        cart.products.map(async (e) => {
          const product = await ProductService.getById(e.product);
          return product;
        })
      );
      const ticket = await TicketService.create({
        code: generateRandomString(),
        purchase_datetime: new Date(),
        amount: totalCart,
        purchaser: user.email,
        products: purchasedProductsComplete
      });
      markTokenAsProcessed(paymentToken)
      res.render("successPayment", ticket);
      req.logger.info("Generated Ticket: ", ticket);
      // console.log(ticket);
    } catch (error) {
      req.logger.error(error);

    }
  }
};
