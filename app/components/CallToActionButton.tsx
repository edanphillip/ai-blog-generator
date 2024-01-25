'use client'
import Link from "next/link"
import coin from "/public/coin.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { backOff } from "exponential-backoff"
import gettokens from "../api/getTokens/gettokens"
import { RingLoader } from "react-spinners"
import { primary } from "@/tailwind.config"
const PurchaseTokensButton = ({ route = "/login", className: classname = "", cta = "Purchase Tokens" }: { route: string, cta?: string, className?: string }) => {

  const [hovering, setHovering] = useState(false)
  const { isSignedIn, user } = useUser();
  const [tokens, settokens] = useState<number | null>(null)
  useEffect(() => {
    if (isSignedIn) {
      const tokens = async () => backOff(gettokens, { delayFirstAttempt: false, startingDelay: 1000, timeMultiple: 1.2 })
        .then(res => {
          settokens(res)
        });
      tokens();
    }
  }, [isSignedIn])
  return (
    <>
      <Link
        href={route}
        onMouseOver={() => { setHovering(true) }}
        onMouseLeave={() => { setHovering(false) }}
        className={"flex flex-row gap-3    duration-300  rounded-md   text-center py-2 pr-4 pl-4 min-w-[100px] min-h-[30px] items-center border-2 md:text-black  text-lg font-medium   border-primary-200/20   transition-all bg-gradient-to-tl hover:from-primary-500 hover:bg-primary-700 from-primary-700 bg-primary-500 px-4 " + classname}>
        {!tokens ? <RingLoader size={18} color={primary[700]} /> : <p>{tokens} tokens</p>}
        <span hidden={!hovering}>{cta}</span>
        <Image className={hovering ? "animate-spin" : ""} src={coin.src} alt="coin" height={24} width={24} />
      </Link>
    </>
  )
}

export default PurchaseTokensButton