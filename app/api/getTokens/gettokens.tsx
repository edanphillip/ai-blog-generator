"use server"
import { initializeClerkUserIfNotExists } from '@/app/lib/clerk'
import { db } from '@/app/lib/db'
import { tokenTransaction, user } from '@/drizzle/schema'
import { User, currentUser } from '@clerk/nextjs/server'
import 'dotenv/config'
import { and, eq, isNotNull } from 'drizzle-orm'
import Stripe from 'stripe'

// create the connection DATABASE_PASSWORD
const priceid_1000 = process.env.priceid_1000!
const priceid_5000 = process.env.priceid_5000!
const priceid_15000 = process.env.priceid_15000!
const fetchTokensByCurrentUser = async (): Promise<number> => {

  const clerkUser = await currentUser();
  if (!clerkUser) { throw Error("Invalid User. Cant Get Tokens"); }
  await initializeClerkUserIfNotExists(clerkUser);
  //get # of tokens spent 
  let userid = await getuserID(clerkUser)
  let tokens = await fetchTokensByUserID(userid)
  return tokens;
}
export async function fetchTokensByUserID(userID: number) {
  try {
    //get # of tokens spent 
    let tokensSpent = await getTokensSpent(userID)
    //get # of tokens purchased
    const tokensPurchased = await getNumTokensPurchased(userID)
    //calculate # of tokens remaining
    const tokens = tokensPurchased - tokensSpent
    return tokens;
  } catch (error) {
    throw new Error("error getting tokens")
  }
}

async function getTokensSpent(userid: number) {
  let userTokenTransacitons = await db.select()
    .from(tokenTransaction)
    .where(and(eq(tokenTransaction.userId, userid), isNotNull(tokenTransaction.amount)))
  let tokensSpent = 0
  userTokenTransacitons.forEach(transaction => {
    //TODO:make amount not null
    if (Number.isNaN(transaction.amount) || !transaction.amount) {
      return;
    } else {
      tokensSpent += Number.parseInt(transaction.amount)
    }
  })
  return tokensSpent
}

async function getNumTokensPurchased(userID: number) {
  //validate user ever even purchased tokens
  const userrecords = await db.select({ stripeid: user.stripeid })
    .from(user)
    .where(eq(user.id, userID))
  if (userrecords.length == 0) throw Error("Invalid ClerkID")
  const sripeid = userrecords[0].stripeid
  if (!sripeid) {
    // Stripe ID not set for user  so return
    return 0
  }
  let tokensPurchased = 0;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  // const stripePaymentIntents = await stripe.checkout.sessions.list({ customer: sripeid, status: "complete" })
  const sessions = await stripe.checkout.sessions.list({ customer: sripeid, status: "complete", expand: ['data.line_items.data.price', 'data.payment_intent'] })
  sessions.data.forEach(session => {
    let intent = session.payment_intent as Stripe.PaymentIntent;
    if (intent.status == "succeeded") {
      // if (session.payment_status == "paid") {
      session.line_items?.data.forEach(lineitemdata => {
        let quantity = lineitemdata.quantity || 0
        let line_tokens = 0;
        switch (lineitemdata.price?.id) {
          case priceid_1000:
            line_tokens = 1000
            break;
          case priceid_5000:
            line_tokens = 5000
            break;
          case priceid_15000:
            line_tokens = 15000
            break;
          default:
            line_tokens = 0
        }
        if (line_tokens > 0) {
          tokensPurchased += (line_tokens * quantity)
        }
      });
    }
  })
  return tokensPurchased;
}
async function getuserID(clerkUser: User) {
  const records = await db.select({ id: user.id })
    .from(user)
    .where(eq(user.clerkid, clerkUser.id))
  if (records.length == 0) {
    throw Error("Clerk User Id Not Found in Database.")
  }
  const userid = records[0].id
  return userid
}
export default fetchTokensByCurrentUser


