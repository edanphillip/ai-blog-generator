import { user } from "@/drizzle/schema"
import { Clerk } from "@clerk/nextjs/server"
import { db } from "./db"


export default async function syncClerkWithPlanetscale() { //deprecated
  const userlist = await Clerk({ secretKey: process.env.CLERK_SECRET_KEY }).users.getUserList()
  console.log(userlist)
  userlist.forEach(clerkuser => {
    const clerkid = clerkuser.id;
    const email = clerkuser.emailAddresses.find(email => email.id == clerkuser.primaryEmailAddressId!)?.emailAddress
    if (!email) { return }
    db.insert(user)
      .values({ clerkid, email })
      .catch(err => {
        console.log(err)
      })
    //problem: you just created an account but planetscale says you email is already in the system so data is out of sync
    // happens when webhooks were missed
    //i just want clerk to be in sync with the database without losing track of a clerk id's tokens if they delete their account
    //add all clerk objects to databse (disable email as a primary key)
    //sync function finds the email thats not on the clerk user list
    //set it to archived
    //when selecting, 
  })
  return;
}