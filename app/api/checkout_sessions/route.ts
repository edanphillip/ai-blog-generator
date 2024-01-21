"use server"
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from '@clerk/nextjs/server';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request, res: NextApiResponse) {
  // const { userId } = getAuth(req);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  const baseURL = "http://localhost:3000/buytokens"
  const success_url = baseURL + "?success=true"
  const cancel_url = baseURL + "?canceled=true"
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: process.env.priceid1,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      automatic_tax: { enabled: true },
    });
    return Response.redirect(session.url!, 303);

  } catch (err: any) {
    return Response.json({ message: (err.message) }, { status: (err.statusCode || 500) });

  }
}
