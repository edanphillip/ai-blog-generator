"use client"
import { cn } from '@/lib/utils'
import { SignUp, useUser } from '@clerk/nextjs'
import { Inter as Font } from 'next/font/google'
import { redirect } from 'next/navigation'
import Footer from '../components/Footer'
const font = Font({ weight: "800", subsets: ["latin"], display: "swap" })
const Page = () => {
  const { isLoaded, isSignedIn } = useUser();
  if (isLoaded && isSignedIn) redirect("/dashboard")
  return (
    <div>
      <div className={cn('flex flex-col lg:flex-row text-center  items-center mx-auto justify-center lg: py-4', font.className)}>
        <h1 className='text-4xl leading-tight text-accent-content p-4 font-black text-right'>
          <span className=' bg-neutral text-secondary-content px-2 justify-self-start'>Try the</span><br />
          <span className='bg-accent text-accent-content px-2'>#1 AI Blog Generator</span><br />
          For <span className='bg-green-500 px-2 rou'>Free</span>
        </h1>
        <SignUp />
      </div>
      <Footer />
    </div>
  )
}

export default Page