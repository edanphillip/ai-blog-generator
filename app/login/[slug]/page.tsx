import React from 'react'
import { SignIn } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <div className='mx-auto py-24'>
        <SignIn />
      </div>
    </div>
  )
}

export default page