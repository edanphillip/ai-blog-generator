import { db } from '@/app/lib/db';
import { stripeTransaction, user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextApiResponse } from 'next';
import { headers } from 'next/headers';
import { Stripe } from 'stripe';

const endpointSecret = process.env.endpointSecret;
var count = 1;

export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status: number = 400) => { return Response.json({ message: message }, { status: status }) }
  if (!endpointSecret) return error(".env variables missing", 500);
  //TODO PROTECT ENDPOINT


  var buffer = await req.text();
  var sig = await headers().then(headers => headers.get("stripe-signature"));
  let event;
  try {
    event = Stripe.webhooks.constructEvent(buffer, sig!, endpointSecret);
  } catch (err: any) {
    return error(`Webhook Error: ${err.message}`, 400);
  }
  const handleNewStripeCustomer = async (stripecustomer: Stripe.Customer) => {
    await db.update(user)
      .set({ stripeId: stripecustomer.id })
      .where(eq(user.email, stripecustomer.email!))
  }
  const handlepaymentSuccess = async (payment: Stripe.PaymentIntent) => {
    try {
      // customer MUST exist or they couldnt have paid!?
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
      if (!payment.customer) return error("wtf how is there no customer?")
      const parsedUserID = Number.parseInt(payment.metadata.userId)//?
      //add transaction to transaction list
      await db.insert(stripeTransaction)
        .values({
          amountPaid: (payment.amount / 1000).toFixed(2),
          transactionId: payment.id,
          createdAt: new Date().toISOString(),
          userId: parsedUserID,
        })
      //udate customer record
      // await db.insert(tokenTransaction)
      //   .values({ timestamp, amountPaid: payment.amount })
    } catch (error) {

    };
  }
  const handleSucceededCharge = async (charge: Stripe.Charge) => {
    try {
      // customer MUST exist or they couldnt have paid!?
      if (!charge.customer) return error("wtf how is there no customer?")
      const parsedUserID = Number.parseInt(charge.metadata.userId)//?
      //add transaction to transaction list
      await db.insert(stripeTransaction)
        .values({
          amountPaid: (charge.amount / 1000).toFixed(2),
          transactionId: charge.id,
          createdAt: new Date().toISOString(),
          userId: parsedUserID,
        })
      //udate customer record
      // await db.insert(tokenTransaction)
      //   .values({ timestamp, amountPaid: payment.amount })
    } catch (error) {

    };
  }
  switch (event.type) {
    case 'customer.created':
      const customer = event.data.object;
      await handleNewStripeCustomer(customer)
      break;
    case 'payment_intent.succeeded':
      const succeededPayment = event.data.object;
      handlepaymentSuccess(succeededPayment)
      break;
    case 'charge.succeeded': {
      const succeededCharge = event.data.object;
      handleSucceededCharge(succeededCharge)
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  console.log(count++, event)
  // Return a 200 response to acknowledge receipt of the event 
  const syncTransactions = async () => {

  }
  return Response.json("success")
}

