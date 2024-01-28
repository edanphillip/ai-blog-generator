"use server"
import getconflicts from '@/app/lib/getconflicts';
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { db } from './db';
import error from './errorHandler';

export async function initalizeStripeCustomerIfNotExists(email: string, clerkID: string) {
  // check if user's current stripe field is null (meaning that the clerk user is not connected to stripe)
  const record = await db.select({ stripeid: user.stripeid })
    .from(user)
    .where(eq(user.clerkid, clerkID))
    .execute();
  if (record.length > 0) {
    let stripeid = record[0].stripeid;
    if (stripeid) {
      return (stripeid)
    }
  }

  //else, 
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  if (!stripe) error("failed to connect to stripe, check env", 500);
  const customer = await stripe.customers.create({ email, metadata: { clerkID } });
  if (!customer) error("failed to create customer", 500);
  try {
    const stripeidconflicts = await getconflicts(user, user.stripeid, customer.id);
    if (stripeidconflicts.length > 0)
      return null
    //insert customer id into db where this.clerkid = db.clerkid
    var result = await db.update(user)
      .set({ stripeid: customer.id })
      .where(eq(user.clerkid, clerkID))
      .execute();
    console.log(result)
  } catch (error: any) {
    console.error(error)
  }
  return customer.id;
}