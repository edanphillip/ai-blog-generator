'use client'
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { RingLoader } from "react-spinners"
import { useData } from "../DataContext"
import coin from "/public/coin.png"
const PurchaseTokensButton = ({ route = "/login", className: classname = "", cta = "Get Tokens" }: { route: string, cta?: string, className?: string }) => {

  const [hovering, setHovering] = useState(false)
  const { tokens } = useData();
  return (
    <>
      <Link
        href={route}
        onMouseOver={() => { setHovering(true) }}
        onMouseLeave={() => { setHovering(false) }}
        className={"flex flex-row gap-3 hover:bg-primary-900 hover:text-black rounded-md   transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-primary " + classname}>
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