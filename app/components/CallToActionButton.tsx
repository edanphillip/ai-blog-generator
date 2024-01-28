'use client'
import Link from "next/link"
import coin from "/public/coin.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { backOff } from "exponential-backoff"
import gettokens from "../api/getTokens/gettokens"
import { RingLoader } from "react-spinners"
const PurchaseTokensButton = ({ route = "/login", className: classname = "", cta = "Get Tokens" }: { route: string, cta?: string, className?: string }) => {

  const [hovering, setHovering] = useState(false)
  const { isSignedIn } = useUser();
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
        className={"flex flex-row gap-3 duration-300  rounded-md   text-center py-2 pr-4 pl-4 min-w-[100px] min-h-[30px] items-center border-2  text-lg font-medium   border-neutral/20   transition-all bg-gradient-to-tl hover:from-neutral  hover:bg-neutral  from-neutral  bg-neutral  px-4 " + classname}>
        <Image className={hovering ? "animate-spin" : ""} src={coin.src} alt="coin" height={22} width={22} />
        {!hovering && <>
          {tokens && <p>{tokens}</p>}
          {!tokens && <RingLoader size={18} color="white" />}
        </>
        }
        <span hidden={!hovering}>{cta}</span>
      </Link >
    </>
  )
}

export default PurchaseTokensButton