import { tokenTransaction, user } from "@/drizzle/schema";
import { User } from "@clerk/nextjs/server";
import { error } from "console";
import { and, eq, sql } from "drizzle-orm";
import { fetchTokensByUserID } from "../api/getTokens/gettokens";
import { db } from './db';
import { getDatabaseMatches, getDatabaseMatches2 } from "./getDatabaseMatches";
export const initializeClerkUserIfNotExists = async (clerkUser: User) => {
  try {
    //check for clerk user in DB
    const clerkidconflicts = await getDatabaseMatches(user, user.clerkid, clerkUser.id);
    if (clerkidconflicts.length > 0) {
      console.log("clerk id found, user" + clerkUser.id + " already exists", clerkidconflicts);
      return;
    }
    //initialize clerk user
    await initializeClerkUser(clerkUser);
  } catch (error: any) {
    console.error(error);
  }

};
export const initializeClerkUser = async (clerkUser: User) => {
  let clerkid = clerkUser.id;
  if (!clerkid) return;
  if (!defaultTokens) throw new Error("Initializing User failed, code 1010");
  //check for matching emails 
  const email = clerkUser.emailAddresses.find(em => em.id == clerkUser.primaryEmailAddressId)!.emailAddress;
  //get matches that are not deleted
  if (!email) throw new Error("Initializing User failed, code 1011");
  const emailConflicts = await getDatabaseMatches2(user, user.email, email, user.deleted, 0);
  let filteredEmailConflicts = emailConflicts.filter(e => {
    return e.clerkid !== clerkid
  })
  let initialTokens = await calculateStarterTokens(filteredEmailConflicts);

  await db.insert(user)
    .values({
      email,
      clerkid,
    })
    .execute()
    .then(res => {
      //insert the default tokens as a token transaction for this user
      console.log("created user:", res);
      db.insert(tokenTransaction)
        .values({ userId: Number.parseInt(res.insertId), amount: (-1 * initialTokens).toFixed(2), timestamp: sql`CURRENT_TIMESTAMP` })
        .execute()
        .then(res => {
          console.log("inserted transaction:", res);
        });
    });
  return;
};


const defaultTokens = process.env.defaultUserTokens;
async function calculateStarterTokens(emailConflicts: { [x: string]: unknown; }[]) {
  if (!defaultTokens) throw error("cant calculate starter tokens. check env")
  let initialTokens = null;
  if (emailConflicts.length > 0) {
    /*if a matching email is found in the database,
    set that record to deleted,
    calculate all the tokens that this email had from previous accounts,
    set the new account to have that many tokens
    */
    let emailTokens = 0;
    console.log("email already exists in planetscale", emailConflicts);
    //go through each email conflict and set the record to deleted. 
    //then, add that record's balance to the  emailTokens which is the running total of all tokens associated with an email address
    await Promise.all(emailConflicts.map(async (record) => {
      emailTokens += await fetchTokensByUserID(record.id as number);
      await db.update(user)
        .set({ deleted: 1 })
        .where(and(eq(user.id, record.id as number)));
    }));
    console.log(`user had ${emailTokens}tokens`);
    initialTokens = emailTokens;
  }
  if (initialTokens == null)
    return Number.parseFloat(defaultTokens)
  else
    return initialTokens;
}

