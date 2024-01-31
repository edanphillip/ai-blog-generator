'use client'
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { RingLoader } from 'react-spinners';
import PurchaseTokensButton from './CallToActionButton';
import CustomNavBarLink from './CustomNavBarLink';
import RegisterLink from './RegisterLink';

const NavBar = () => {
    const currentRoute = usePathname();

    const { isSignedIn, isLoaded } = useUser();
    const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
    return (
        <div className={"bg-primary border-gray-200"}>
            <div className="max-w-screen-2xl flex flex-col md:flex-row items-center justify-between mx-auto py-2 ">
                <div className='relative'>
                    <Link href="/" className='select-none absolute z-10 top-[1px] left-[1px]  text-accent-content font-extrabold flex hover:drop-shadow-xl shadow-accent-content shadow-tahiti-400 mx-4 self-center whitespace-nowrap text-2xl '>AI Blog Generator</Link>
                    <Link href="/" className='select-none absolue z-0 text-accent font-extrabold flex hover:drop-shadow-xl shadow-tahiti-400 mx-4 self-center whitespace-nowrap text-2xl '>
                        AI Blog Generator
                    </Link>
                </div>
                <button onClick={() => setHamburgerOpen(!hamburgerIsOpen)} type="button" className="w-screen inline-flex items-center p-2 md:w-10 h-10 justify-center text-sm   rounded-lg md:hidden   focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div hidden={!hamburgerIsOpen} className=" w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col mt-4 p-4 border border-gray-100 rounded-lg rtl:space-x-reverse     
                    md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
                        <CustomNavBarLink route="/" text='Home' />
                        {!isLoaded && <>
                            {currentRoute !== "/login"
                                && <RingLoader size={22} />
                            }
                        </>}
                        {isLoaded && !isSignedIn && <>
                            {currentRoute !== "/login"
                                && <RegisterLink />
                            }
                        </>}
                        {isLoaded && isSignedIn && <>
                            <CustomNavBarLink route="/dashboard" text="Dashboard" />
                            <PurchaseTokensButton route="/buytokens" className="transform rounded-md bg-gradient-to-t transition-all px-4 py-1 justify-center font-medium " />
                            <li className={'flex flex-row relative gap-2 mt-4 md:mt-0 justify-center  align-middle text-center items-center '}>
                                <UserButton afterSignOutUrl="/" />
                            </li>
                        </>}
                    </ul>
                </div>
            </div>
        </div >
    )
}
export default NavBar