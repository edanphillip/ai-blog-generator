import React from 'react'
import { SignUp } from '@clerk/nextjs'
const page = () => {
  return (
    <div className='bg-primary h-screen'>
      <div className='flex mx-auto justify-center py-10'>
        <SignUp />
      </div>
    </div>
  )
}

export default page