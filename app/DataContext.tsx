'use client'
import { ReactNode, createContext, useContext, useState } from "react";
import fetchTokensByCurrentUser from "./api/getTokens/gettokens";
import getTokenShopPrice, { TokenShopParams } from "./lib/getprices";

export type DataContextValueProps = {
  tokens: number | null,
  getTokenShopPrice: ({ model, service }: TokenShopParams) => number,
  updateTokens: () => Promise<number>;
}

export const DataContext = createContext<DataContextValueProps>({
  tokens: 0,
  updateTokens: async () => Number.NaN,
  getTokenShopPrice: ({ model, service }: TokenShopParams) => 1,
});
interface ContextProviderProps {
  children: ReactNode;
}
export const DataContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<number | null>(0);
  const updateTokens = async () => {
    let currTokens = await fetchTokensByCurrentUser()
    setTokens(currTokens)
    return currTokens
  }

  const data: DataContextValueProps = {
    tokens,
    updateTokens,
    getTokenShopPrice
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
export const useData = () => {
  return useContext(DataContext);
};