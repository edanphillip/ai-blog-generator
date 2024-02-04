import { SignIn, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
const Page = () => {
  const { isLoaded, isSignedIn } = useUser();
  if (isLoaded && isSignedIn) redirect("/dashboard")
  return (
    <div>
      <div className='flex mx-auto justify-center py-10'>
        <SignIn signUpUrl='/register' />
      </div>
    </div>
  )
}

export default Page