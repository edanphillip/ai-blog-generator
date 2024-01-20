'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import CustomNavBarLink from './CustomNavBarLink';
import CallToActionButton from './CallToActionButton';
const NavBar = () => {
    const [hamburgerIsOpen, setHamburgerOpen] = useState(false);
    return (
        <nav className="bg-[#393939] border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <Link href="/" className='flex hover:drop-shadow-xl shadow-tahiti-400'>
                    <span className=" mx-4 self-center whitespace-nowrap text-2xl  font-semibold text-primaryText-light text-white">AI Blog Generator</span>
                </Link>
                <button onClick={() => setHamburgerOpen(!hamburgerIsOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden   focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div hidden={!hamburgerIsOpen} className=" w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col mt-4 p-4 border border-gray-100 rounded-lg rtl:space-x-reverse     
                    md:p-0 md:flex-row md:space-x-8 md:mt-0 md:border-0">
                        <CustomNavBarLink route="/" text='Home' />
                        <CustomNavBarLink route="/login" text="Register/Login" />
                        <CallToActionButton className="transform rounded-md bg-gradient-to-t transition-all hover:from-primary-500 from-primary-700  bg-primary-600/95 px-4 py-1 font-medium text-primaryText-light  font- hover:bg-primary-500/90" />

                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default NavBar