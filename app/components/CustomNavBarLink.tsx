'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Amarante as Font } from 'next/font/google'
const font = Font({ weight: "400", subsets: ["latin"], display: "swap" })
export const CustomNavBarLink = ({ route, text }: { route: string, text: string }) => {
  const currentRoute = usePathname();
  return <li>
    {currentRoute === route && <Link className={"hover:bg-primary-900 hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg  text-primaryText-light border-primary-200/20 md:bg-transparent md:border- md:text-primary-500" + font.className} href={route}  >{text}</Link>}
    {currentRoute !== route && <Link className={"hover:bg-primary-900 hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg     border-primary-200/20 text-primaryText-light md:border-0 md:hover:text-primary-300" + font.className} href={route}  >{text}</Link>}
  </li>
}
export default CustomNavBarLink
