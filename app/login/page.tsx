import React from 'react'
import NavBar from '../components/NavBar'
import { SignIn } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <NavBar />
      <div className='flex mx-auto justify-center py-10'>
        <SignIn />
      </div>
    </div>
  )
}

export default page