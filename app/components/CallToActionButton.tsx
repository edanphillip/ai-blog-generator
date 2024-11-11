'use client'
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { RingLoader } from "react-spinners"
import { useData } from "../DataContext"
import coin from "/public/coin.png"
const PurchaseTokensButton = ({ route = "/register", className: classname = "", cta = "Get Tokens" }: { route: string, cta?: string, className?: string }) => {

  const [hovering, setHovering] = useState(false)
  const { tokens, updateTokens } = useData();
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      updateTokens();
    }
  }, [isSignedIn, isLoaded, updateTokens])
  
  return (
    <>
      <Link
        href={route}
        onMouseOver={() => { setHovering(true) }}
        onMouseLeave={() => { setHovering(false) }}
        className={"flex flex-row gap-3 justify-center bg-accent/40 hover:bg-accent hover:text-black rounded-md   transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-primary " + classname}>
        <Image className={hovering ? "animate-spin" : ""} src={coin.src} alt="coin" height={22} width={22} />
        {!hovering && <>
          {tokens == null && <RingLoader size={18} color="white" />}
          {tokens && <p>{tokens}</p>}
        </>
        }
        <span hidden={!hovering}>{cta}</span>
      </Link >
    </>
  )
}

export default PurchaseTokensButton