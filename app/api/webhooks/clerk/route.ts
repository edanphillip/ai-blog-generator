import { NextApiResponse } from 'next';
import { Stripe } from 'stripe';
import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { headers } from 'next/headers'
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { user } from '@/drizzle/schema';
import { Column, ColumnBaseConfig, ColumnDataType, eq } from 'drizzle-orm';
import { User } from '@clerk/nextjs/api';
import { MySqlTable } from 'drizzle-orm/mysql-core';
import { error, log } from 'console';

var count = 1;

export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status: number = 400) => { return Response.json({ message: message }, { status: status }) }
  var headrs = headers().get("Authorization");
  const endpointSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!endpointSecret) return error(".env variables missing", 500);
  var event = await req.json() as WebhookEvent
  if (!event) return error('invalid body recieved at clerk hook', 400)
  const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  })
  const db = drizzle(connection)
  if (!db) return error("connection failed", 500);
  switch (event.type) {
    case 'user.created': {
      const email = event.data.email_addresses[0].email_address;//verify that its their email first
      //add this user to the planetscale database      
      try {
        const clerkidconflicts = await getconflicts(user, user.clerkid, event.data.id);
        const emailConflicts = await getconflicts(user, user.email, email);
        if (clerkidconflicts.length > 0) { console.error("clerk id conflicts conflicts, user already exists", clerkidconflicts) }
        if (emailConflicts.length > 0) log("email already exists in planetscale")
        if (clerkidconflicts.length == 0) { initializeClerkUser({ email, clerkid: event.data.id }) }
      } catch (error: any) {
        console.error(error)
      }
      break;
    }
    case 'user.updated': {
      // const email = event.data.email_addresses[0].email_address;//verify that its their email first
      //edit this user to the planetscale database
      // initializeUser({ email, clerkid: event.data.id })
      break;
    }
    case 'user.deleted': {
      const connection = connect({
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
      })
      const db = drizzle(connection)
      await db.delete(user)
        .where(eq(user.clerkid, event.data.id!))
        .execute().then(res => {
          console.log("deleted", res);
        }).catch(err => {
          console.error(err)
        })
      break;
    }
  }

  // Return a 200 response to acknowledge receipt of the event   
  return Response.json({ message: "success" })
}

export const initializeClerkUser = ({ email, clerkid }: { email: string, clerkid: string }) => {
  if (!email) return;
  if (!clerkid) return;
  const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  })
  const db = drizzle(connection)

  db.insert(user)
    .values({
      email,
      clerkid,
      tokens: 500
    })
    .execute()
    .then(res => {
      console.log("created", res);
    })

}
async function getconflicts(table: MySqlTable, column: Column<ColumnBaseConfig<ColumnDataType, string>, object, object>, comparison: any) {
  const connection = connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  })
  const db = drizzle(connection)
  const conflicts = await db.select()
    .from(table)
    .where(eq(column, comparison))
  return conflicts
}
export const initializeClerkUserIfNotExists = async (clerkUser: User) => {
  try {
    const clerkidconflicts = await getconflicts(user, user.clerkid, clerkUser.id);
    if (clerkidconflicts.length > 0) {
      console.error("clerk id conflicts conflicts, user already exists", clerkidconflicts)
    }
    const emailConflicts = await getconflicts(user, user.email, clerkUser.emailAddresses[0].emailAddress);
    if (emailConflicts.length > 0)
      log("email already exists in planetscale")
    if (clerkidconflicts.length == 0) {
      initializeClerkUser({ email: clerkUser.emailAddresses[0].emailAddress, clerkid: clerkUser.id })
    }
  } catch (error: any) {
    console.error(error)
  }
}
export const linkStripeWithPlanetscale = async (clerkUser: User, stripeCustomerID: string) => {
  try {
    const connection = connect({
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    })
    const db = drizzle(connection)
    const results = await db.update(user)
      .set({ stripeid: stripeCustomerID })
      .where(eq(user.clerkid, clerkUser.id))
  } catch (error: any) {
    console.error(error)
  }
}