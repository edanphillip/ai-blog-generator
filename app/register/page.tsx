import React from 'react'
import NavBar from '../components/NavBar'
import { SignIn, SignUp } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <NavBar />
      <div className='flex mx-auto justify-center py-10'>
        <SignUp />
      </div>
    </div>
  )
}

export default page