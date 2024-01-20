'use client'

import { RedirectToSignIn, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const CallToActionButton = ({ route = "/login", className: classname = "", cta = "Purchase Tokens" }: { route: string, cta?: string, className?: string }) => {
  return (
    <>
      <button
        onClick={() => {
          RedirectToSignIn({ afterSignInUrl: route })
        }}
        className={"hover:bg-primary-900 bg-primary-500  rounded-md block  duration-200 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg font-medium text-primaryText-light md:hover:text-primary-300 border-primary-200/20   md:border- md:text-black transform hover:font-semibold transition-all hover:from-primary-500 from-primary-700  bg-primary-600/95 px-4  text-primaryText-light    " + classname}>
        {cta}
      </button>
    </>
  )
}

export default CallToActionButton