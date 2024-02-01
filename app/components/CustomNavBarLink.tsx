'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export const CustomNavBarLink = ({ route, text }: { route: string, text: string }) => {
  const currentRoute = usePathname();
  return <li>
    {/* {currentRoute === route && <Link className={"hover:bg-primary-900 hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-accent underline-offset-8 underline "} href={route}  >{text}</Link>}
    {currentRoute !== route && <Link className={"hover:bg-primary-900 hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-primary "} href={route}  >{text}</Link>} */}
    {/* hear me out chrome tab edition */}
    {currentRoute === route && <Link className={" hover:bg-accent/70   hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-accent underline-offset-8 underline "} href={route}  >{text}</Link>}
    {currentRoute !== route && <Link className={" hover:bg-accent/70 hover:text-black rounded-md block transition-all duration-300 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg border-primary-200/20 text-primary "} href={route}  >{text}</Link>}
  </li>
}
export default CustomNavBarLink
