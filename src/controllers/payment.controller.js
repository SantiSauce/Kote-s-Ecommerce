import { CartService } from "../repository/index.js";
import { UserService } from "../repository/index.js";
import { TicketService } from "../repository/index.js";
import { ProductService } from "../repository/index.js";
import { generateRandomString } from "../public/js/generateRandomString.js";
import CustomError from "../services/errors/customError.js";
import { ERRORS_ENUM } from "../consts/ERRORS.js";

export const completePayment = async (req, res, next) => {
  const { cid } = req.body;
  try {
    const cartRequested = await CartService.getById(cid);

    if (!cartRequested) {
      return res
        .status(404)
        .send({ status: "error", error: "Product not found" });
    }

    const totalCart = await CartService.getTotal(cid);

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
      success_url: `http://localhost:8082/api/payments/success/${cid}`,
      cancel_url: "http://localhost:8082/api/payments/cancel",
    });

    res.send({ status: "success", payload: session });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", error: "Failed to create Checkout Session" });
  }
};
