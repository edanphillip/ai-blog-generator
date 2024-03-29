"use server"
import { initializeClerkUserIfNotExists } from '@/app/lib/clerk';
import error from '@/app/lib/errorHandler';
import { initalizeStripeCustomerIfNotExists } from '@/app/lib/stripe';
import { currentUser } from '@clerk/nextjs/server';
import { log } from 'console';
import Stripe from 'stripe';
export async function GET(req: Request, { params }: { params: { priceid: string } }) {
  if (!params.priceid) return error("Invalid Params", 401)
  let priceid = params.priceid;
  const clerkUser = await currentUser();
  if (!clerkUser) return error("Invalid User", 401)
  if (!clerkUser.emailAddresses) return error("No Associated Email Address", 401)
  //if first purchase
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  const hostedURL = process.env.VERCEL_URL;

  console.log(`The application is hosted at: ${hostedURL}`);
  const baseURL = "http://" + hostedURL //TODO:verify this works on prod server then remove this comment
  const success_url = baseURL + "?success=true"
  const cancel_url = baseURL + "?canceled=true"
  try {
    var primaryEmail = clerkUser.emailAddresses.find(em => em.id == clerkUser.primaryEmailAddressId);
    if (!primaryEmail) return error("Invalid email");
    log(primaryEmail.verification?.status)
    if (primaryEmail.verification?.status !== "verified")
      if (!primaryEmail.verification)
        return Response.redirect("/emailverification", 303);
    // Create stripe customer if none exists
    //1 add clerk user to db if none exists
    await initializeClerkUserIfNotExists(clerkUser);
    //2 add stripeid
    const customerID = await initalizeStripeCustomerIfNotExists(primaryEmail.emailAddress, clerkUser.id);
    if (!customerID) return error("Error getting customerID from stripe", 500)
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,

      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: priceid,
          quantity: 1,
        },
      ],
      invoice_creation: { enabled: true },
      customer_update: { address: "auto" },
      customer: customerID,
      client_reference_id: clerkUser.id + " " + new Date().toISOString(),
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      automatic_tax: { enabled: true },
    })
    return Response.redirect(session.url!, 301);
  } catch (err: any) {
    return Response.json({ message: (err.message) }, { status: (err.statusCode || 500) });
  }
}


