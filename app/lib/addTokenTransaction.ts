import { tokenTransaction, user } from '@/drizzle/schema'
import { eq, sql } from 'drizzle-orm'
import { db } from './db'
interface AddTokenTransactionProps {
  tokensUsed: number,
  clerkID: string,
  userPrompt: string,
}
const addTokenTransaction = async ({ tokensUsed, clerkID, userPrompt }: AddTokenTransactionProps) => {
  //validate params
  if (!tokensUsed) return console.error("wtf how is there no customer?")
  if (!clerkID) return console.error("wtf how is there no clerkID?")
  if (!userPrompt) return console.error("wtf how is there no userPrompt?")
  try {
    //connect 
    const records = await db.select({ user }).from(user).where(eq(user.clerkid, clerkID))
    if (records.length == 0) return console.error("wtf how is there no record of this clerkid?")
    const userId = records[0].user.id
    //add transaction to transaction list 
    const inserted = await db.insert(tokenTransaction)
      .values({ userId, amount: tokensUsed.toString(), timestamp: sql`CURRENT_TIMESTAMP` })
    console.log(inserted)
    if (inserted.rowsAffected == 0) {
      return console.error("wtf how is there no inserted row?")
    }
    //TODO:revert charge if server failed
    //udate customer record
    // await db.insert(tokenTransaction)
    //   .values({ timestamp, amountPaid: payment.amount })
  } catch (error: any) {
    return console.error(error)
  };
}

export default addTokenTransaction  