"use server"

import { NextApiResponse } from "next";
import gettokens from "./gettokens";

export async function POST(req: Request, res: NextApiResponse) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  try {
    return Response.json({ tokens: await gettokens() });
  } catch (error: any) {
    return error(error)
  }
}  