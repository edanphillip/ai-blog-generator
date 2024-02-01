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
    if (isSignedIn && isLoaded)
      setloadingPage(false)
  }, [isSignedIn, isLoaded])

  //if user/page loading
  if (!isLoaded || loadingPage) { return <div className="flex flex-col justify-center items-center h-screen bg-secondary"><BeatLoader loading color="white" /></div>; }
  //if user/page loading
  else if (isSignedIn && isLoaded) { return <Dashboard /> }
  //verify signed in stage
  else { console.error("isSignedIn && !isLoaded") }
  // else { redirect("/login") }
}

export default Page;



