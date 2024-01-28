'use client'
import { BeatLoader } from "react-spinners";
export interface blogidea {
  idea: string,
}

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from 'react';
import { Dashboard } from "./Dashboard";

const Page = () => {
  const [loadingPage, setloadingPage] = useState(true)
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    if (isSignedIn && isLoaded)
      setloadingPage(false)
  }, [isSignedIn, isLoaded])

  if (!isLoaded && loadingPage) { return <div className="flex flex-col justify-center items-center h-screen bg-secondary"><BeatLoader loading color="white" /></div>; } else
    if (isSignedIn && isLoaded) { return <Dashboard /> }
    else { redirect("/login") }
}

export default Page;



