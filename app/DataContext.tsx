'use client'
import { ReactNode, createContext, useContext, useState } from "react";
import gettokens from "./api/getTokens/gettokens";

export type DataContextValueProps = {
  tokens: number | null,
  updateTokens: () => void;
}

export const DataContext = createContext<DataContextValueProps>({
  tokens: 0,
  updateTokens: () => { },
});
interface ContextProviderProps {
  children: ReactNode;
}
export const DataContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [tokens, setTokens] = useState<number | null>(0);
  const updateTokens = async () => {
    setTokens(await gettokens())
  }
  const data: DataContextValueProps = {
    tokens,
    updateTokens,
  };

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};
export const useData = () => {
  return useContext(DataContext);
};