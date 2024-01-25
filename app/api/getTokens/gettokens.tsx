"use server"
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import { user } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { initializeClerkUserIfNotExists } from '../webhooks/clerk/route'

// create the connection
const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})

const db = drizzle(connection)
let retries = 0
const gettokens = async (): Promise<number | null> => {
  const clerkUser = await currentUser();
  if (!clerkUser) { throw Error("Invalid User. Cant Get Tokens"); }
  const currentuserID = clerkUser.id;
  const result = await db.select({
    clerkid: user.clerkid,
    tokens: user.tokens,
    email: user.email,
  })
    .from(user)
    .where(eq(user.clerkid, currentuserID))
  if (result.length == 0) {
    return null
  }
  let { clerkid, tokens, email } = result[0];
  if (tokens == null) { throw Error(" Cant Get Tokens"); }
  retries = 0
  return tokens;
}

export default gettokens