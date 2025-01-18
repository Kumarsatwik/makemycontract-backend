import { Request, Response } from "express";
import Stripe from "stripe";
import userModel, { IUser } from "../models/user.model";
import { sendEmail } from "../services/email.services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export const createCharge = async (req: Request, res: Response) => {
  const user = req.user as any;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lifetime Subscription to Contract Analysis",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      client_reference_id: user._id.toString(),
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to create charge" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    // req.body is now a Buffer, which is what Stripe needs
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    try {
      if (userId) {
        const user = await userModel.findByIdAndUpdate(
          userId,
          { isPremium: true },
          { new: true }
        );

        if (user?.email) {
          await sendEmail(user.email, user.displayName);
        }
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      // Don't send error response here - we still want to return 200 to Stripe
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  const user = req.user as any;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Lifetime Subscription to Contract Analysis",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`, // Replace with your success page URL
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`, // Replace with your cancel page URL
      client_reference_id: user._id.toString(),
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to create charge" });
  }
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.isPremium) {
    res.json({ status: "active" });
  } else {
    res.json({ status: "inactive" });
  }
};
