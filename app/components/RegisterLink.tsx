'use client'
import Link from "next/link";

export const RegisterLink = () => {
  return <li>
    <Link className={"hover:bg-primary-900 bg-primary-500  rounded-md block  duration-200 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg font-medium text-primaryText-light md:hover:text-primary-300 border-primary-200/20   md:border- md:text-black transform hover:font-semibold transition-all hover:from-primary-500 from-primary-700  bg-primary-600/95 px-4  text-primaryText-light    "} href={"/login"}>Register/SignIn</Link>
  </li>
}
export default RegisterLink
