import { initializeClerkUser } from '@/app/lib/clerk';
import { db } from '@/app/lib/db';
import { getDatabaseMatches } from "@/app/lib/getDatabaseMatches";
import { user } from '@/drizzle/schema';
import { WebhookEvent } from '@clerk/nextjs/server';
import { log } from 'console';
import { eq } from 'drizzle-orm';
import { NextApiResponse } from 'next';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status: number = 400) => { return Response.json({ message: message }, { status: status }) }
  await validateWebhook(req).then(res => {
    if (res?.status! && res.status >= 400) {
      error("invalid webhook request")
    }
  }).catch(err => {
    error(err)
  });
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


async function validateWebhook(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
}