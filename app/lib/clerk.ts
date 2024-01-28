import { user } from "@/drizzle/schema";
import { User } from "@clerk/nextjs/server";
import { db } from './db';
import { getDatabaseMatches } from "./getDatabaseMatches";

export const initializeClerkUserIfNotExists = async (clerkUser: User) => {
  try {

    var email = clerkUser.emailAddresses.find(em => em.id == clerkUser.primaryEmailAddressId)!.emailAddress;
    const clerkidconflicts = await getDatabaseMatches(user, user.clerkid, clerkUser.id);
    const emailConflicts = await getDatabaseMatches(user, user.email, email);

    if (clerkidconflicts.length == 0 && emailConflicts.length == 0) {
      initializeClerkUser({ email, clerkid: clerkUser.id });
    } else {
      //log errors
      if (clerkidconflicts.length > 0)
        console.log("clerk id conflicts conflicts, user already exists", clerkidconflicts);
      if (emailConflicts.length > 0)
        console.log("email already exists in planetscale", emailConflicts);
    }
  } catch (error: any) {
    console.error(error);
  }
}; export const initializeClerkUser = ({ email, clerkid }: { email: string; clerkid: string; }) => {
  if (!email) return;
  if (!clerkid) return;

  db.insert(user)
    .values({
      email,
      clerkid,
      tokens: 500
    })
    .execute()
    .then(res => {
      console.log("created", res);
    });
  return;
};

