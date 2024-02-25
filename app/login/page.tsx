"use client"
import { SignIn, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Footer from '../components/Footer';
const Page = () => {
  const { isLoaded, isSignedIn } = useUser();
  if (isLoaded && isSignedIn) redirect("/dashboard")
  return (
    <div>
      <div className='flex mx-auto justify-center py-10'>
        <SignIn signUpUrl='/register' />
      </div>
      <Footer />
    </div>
  )
}

export default Page