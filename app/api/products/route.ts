"use server"

import getproducts from "@/app/lib/getproducts";
import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  try {
    return Response.json({ products: await getproducts() });
  } catch (error: any) {
    return error(error)
  }
}  