import React from 'react'
import NavBar from '../../components/NavBar'
import { SignIn } from '@clerk/nextjs'
const page = () => {
  return (
    <div>
      <NavBar />
      <div className='mx-auto py-24'>
        <SignIn />
      </div>
    </div>
  )
}

export default page