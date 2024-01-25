"use server"
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from "next";
import { currentUser, getAuth } from '@clerk/nextjs/server';
import { log } from 'console';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { user } from '@/drizzle/schema';
import { initializeClerkUserIfNotExists, linkStripeWithPlanetscale } from '../webhooks/clerk/route';
import { eq } from 'drizzle-orm';
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  const clerkUser = await currentUser();
  if (!clerkUser) return error("Invalid User", 401)
  if (!clerkUser.emailAddresses) return error("No Associated Email Address", 401)
  const db_userID = clerkUser.privateMetadata.userId
  //if first purchase
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  const baseURL = "http://localhost:3000/buytokens"
  const success_url = baseURL + "?success=true"
  const cancel_url = baseURL + "?canceled=true"
  try {
    var email = clerkUser.emailAddresses.find(em => em.id == clerkUser.primaryEmailAddressId);
    if (!email) return error("Invalid email");
    log(email.verification?.status)
    // if (!email.verification)
    //   return Response.redirect("/emailverification", 303);
    // if (!email.verification)
    //   return Response.redirect("/emailverification", 303); 
    // Create stripe customer if none exists
    //1 add clerk user to db if none exists
    await initializeClerkUserIfNotExists(clerkUser);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: process.env.priceid1,
          quantity: 1,
        },
      ],
      // metadata: {
      //   userId: clerkUser.privateMetadata.userId,
      // },
      customer_creation: "always",
      client_reference_id: clerkUser.id,
      customer_email: email.emailAddress,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      automatic_tax: { enabled: true },
    })
    await linkStripeWithPlanetscale(clerkUser, session.customer as string);
    return Response.redirect(session.url!, 303);
  } catch (err: any) {
    return Response.json({ message: (err.message) }, { status: (err.statusCode || 500) });
  }
}
