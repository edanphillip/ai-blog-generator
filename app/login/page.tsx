import React from 'react'
import { SignIn } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <div className='flex mx-auto justify-center py-10'>
        <SignIn signUpUrl='/register' />
      </div>
    </div>
  )
}

export default page