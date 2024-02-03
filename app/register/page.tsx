import { cn } from '@/lib/utils'
import { SignUp } from '@clerk/nextjs'
import { Inter as Font } from 'next/font/google'
const font = Font({ weight: "800", subsets: ["latin"], display: "swap" })
const page = () => {
  return (
    <div>
      <div className={cn('flex flex-col gap-4 text-center  items-center mx-auto justify-center ', font.className)}>
        <h1 className='text-4xl leading-tight text-accent-content font-black'>
          <span className=' bg-green-500 text-secondary-content px-2'>Try the</span><br />
          <span className='bg-accent text-accent-content px-2'>#1 AI Blog Generator</span><br />
          <span className='bg-green-500 px-2'> For Free</span></h1>
        <SignUp />
      </div>
    </div>
  )
}

export default page