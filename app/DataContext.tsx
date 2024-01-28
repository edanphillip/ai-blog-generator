'use client'
import { ReactNode, cache, createContext } from "react";
import gettokens from "./api/getTokens/gettokens";

export type DataContextValueProps = {
  tokens: number
}

export const DataContext = createContext<DataContextValueProps>({ tokens: 0 });

interface contextProps {
  value: DataContextValueProps,
  children: ReactNode,
}
export const DataContextProvider = async ({ value, children }: contextProps) => {
  return (<DataContext.Provider value={value}>{children}</DataContext.Provider>)
}
