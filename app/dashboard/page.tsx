'use client'
import { BeatLoader } from "react-spinners";
export interface blogidea {
  idea: string,
}

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { Dashboard } from "./Dashboard";
export const dynamic = "force-dynamic"
const Page = () => {
  const [loadingPage, setloadingPage] = useState(true)
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded)
      setloadingPage(false)
  }, [isLoaded])

  //if user/page loading
  if (!isLoaded || loadingPage) { return <div className="flex flex-col justify-center items-center h-screen bg-secondary"><BeatLoader loading color="white" /></div>; }
  //if signed in
  else if (!isSignedIn) { console.error("page loaded but user signed out") }
  else { return <Dashboard /> }
  //verify signed in stage
  // else { redirect("/login") }
}

export default Page;



