'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CustomNavBarLink from './CustomNavBarLink';
import PurchaseTokensButton from './CallToActionButton';
import { SignedIn, UserButton, currentUser, useUser } from '@clerk/nextjs';
import RegisterLink from './RegisterLink';
import { usePathname } from 'next/navigation';
import gettokens from '../api/getTokens/gettokens';
import { RingLoader } from 'react-spinners';
import { primary } from '@/tailwind.config';
import { backOff } from 'exponential-backoff';
const NavBar = () => {
    const currentRoute = usePathname();

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
    const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
    return (
        <div className={"bg-[#393939] border-gray-200"}>
            <div className="max-w-screen-xl flex flex-col md:flex-row items-center justify-between mx-auto p-2">
                <Link href="/" className='flex  hover:drop-shadow-xl shadow-tahiti-400 mx-4 self-center whitespace-nowrap text-2xl  font-semibold text-primaryText-light text-white'>
                    AI Blog Generator
                </Link>
                <button onClick={() => setHamburgerOpen(!hamburgerIsOpen)} type="button" className="w-screen inline-flex items-center p-2 md:w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden   focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div hidden={!hamburgerIsOpen} className=" w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col mt-4 p-4 border border-gray-100 rounded-lg rtl:space-x-reverse     
                    md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0 text-white">
                        <CustomNavBarLink route="/" text='Home' />
                        {!isSignedIn && <>
                            {currentRoute !== "/login"
                                && <RegisterLink />
                            }
                        </>}
                        {isSignedIn && <>
                            <CustomNavBarLink route="/dashboard" text="Dashboard" />
                            <PurchaseTokensButton route="/buytokens" className="transform rounded-md bg-gradient-to-t transition-all px-4 py-1 justify-center font-medium text-white  " />
                            <li className={'flex flex-row relative gap-2  justify-center  align-middle text-center items-center '}>
                                <UserButton afterSignOutUrl="/" />
                            </li>
                        </>}
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default NavBar