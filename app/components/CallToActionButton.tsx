'use client'
import Link from "next/link"
import coin from "/public/coin.png"
import Image from "next/image"
import { useState } from "react"
const CallToActionButton = ({ route = "/login", className: classname = "", cta = "Purchase Tokens" }: { route: string, cta?: string, className?: string }) => {
  const [hovering, setHovering] = useState(false)
  return (
    <>
      <Link
        href={route}
        onMouseOver={() => { setHovering(true) }}
        onMouseLeave={() => { setHovering(false) }}
        className={"flex flex-row gap-3    duration-300  rounded-md   text-center py-2 pr-4 pl-4 min-w-[100px] min-h-[30px] items-center border-2 md:text-black  text-lg font-medium   border-primary-200/20 hover:font-semibold transition-all bg-gradient-to-tl hover:from-primary-500 hover:bg-primary-700 from-primary-700 bg-primary-500 px-4 " + classname}>
        <span>{cta}</span>
        <Image className={hovering ? "animate-spin" : ""} src={coin.src} alt="coin" height={24} width={24} />
      </Link>
    </>
  )
}

export default CallToActionButton