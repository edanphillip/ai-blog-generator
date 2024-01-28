import { NextApiResponse } from 'next';
import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { headers } from 'next/headers'
import { user } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { error, log } from 'console';
import { getDatabaseMatches } from "@/app/lib/getDatabaseMatches";
import { initializeClerkUser } from '@/app/lib/clerk';
import { db } from '@/app/lib/db';

var count = 1;

export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status: number = 400) => { return Response.json({ message: message }, { status: status }) }
  var headrs = headers().get("Authorization");//TODO: protect endpoint
  const endpointSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!endpointSecret) return error(".env variables missing", 500);
  var event = await req.json() as WebhookEvent
  if (!event) return error('invalid body recieved at clerk hook', 400)
  if (!db) return error("connection failed", 500);
  switch (event.type) {
    case 'user.created': {
      const email = event.data.email_addresses[0].email_address;//verify that its their email first
      //add this user to the planetscale database      
      try {
        const clerkidconflicts = await getDatabaseMatches(user, user.clerkid, event.data.id);
        const emailConflicts = await getDatabaseMatches(user, user.email, email);
        if (clerkidconflicts.length > 0) { error("clerk id match, user already exists", 400) }
        else if (emailConflicts.length > 0) log("email already exists in planetscale")
        else { initializeClerkUser({ email, clerkid: event.data.id }) }
      } catch (error: any) {
        console.error(error)
      }
      break;
    }
    case 'user.updated': {
      // const email = event.data.email_addresses[0].email_address;//verify that its their email first
      //edit this user to the planetscale database
      // initializeUser({ email, clerkid: event.data.id })
      console.log("user.updated", event);
      break;
    }
    case 'user.deleted': {
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


