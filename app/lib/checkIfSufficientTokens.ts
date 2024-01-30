import { User } from "@clerk/nextjs/server";
import gettokens from "../api/getTokens/gettokens";
import getTokenShopPrice, { TokenShopParams } from "./getprices";

export default async function checkIfSufficientTokens({ model, service }: TokenShopParams, user: User) {
  let serviceTokensCost = 0
  let userTokensAvailable = await gettokens();
  if (userTokensAvailable == null)
    throw Error("Error getting tokens.")
  serviceTokensCost = getTokenShopPrice({ model, service: "blogpostideas" })
  let userCanAfford: boolean = userTokensAvailable >= serviceTokensCost
  return userCanAfford;
}