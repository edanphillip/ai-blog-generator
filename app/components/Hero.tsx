'use client'
import { useUser } from '@clerk/nextjs';
import { Inter as Font, Playfair_Display as Font2 } from 'next/font/google';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
const font = Font({ weight: "700", subsets: ["latin"], display: "swap" })
const magicfont = Font2({ weight: "900", subsets: ["latin"], display: "swap" })
const Hero = () => {
    let { isSignedIn } = useUser();
    return (
        <section className={' m-0 pt-8 font-bold  w-[100%]  ' + font.className}>
            {/* <div className='bg-blend-screen  w-[100%] h-[100%] opacity-20 absolute '></div> */}
            <div className=' flex flex-col gap-8'>
                <div className="  text-center">
                    <p className={' p-2 text-6xl mt-3 font-semibold  leading-relaxed txt ' + magicfont.className}>
                        Magic AI Articles
                    </p>
                    <TypeAnimation
                        className="mt-3 text-lg leading-relaxed  "
                        sequence={[
                            "The #1 AI Assistant for Generating Blog Articles",
                            1000,
                            "The #1 AI Assistant for Generating Blog Ideas",
                            1000,
                            "The #1 AI Assistant for Generating Blog Topics",
                            1000,
                        ]}
                        wrapper="span"
                        speed={50}
                        style={{ fontSize: '2em', display: 'inline-block' }}
                        repeat={Infinity}>
                    </TypeAnimation>
                </div>
                <div className="  flex items-center justify-center gap-4">
                    {!isSignedIn && <>
                        <Link href={"/register "} className="btn btn-neutral ">Try For Free</Link>
                        <Link href="/login" className={"btn btn-outline text-neutral"} >Log In</Link>
                    </>}
                    {isSignedIn && <>
                        <Link href="/login" className={"btn btn-outline text-neutral"} >Dashboard</Link>
                    </>}
                </div>
            </div>
        </section >
    )
}
export default Hero