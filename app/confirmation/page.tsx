"use client"

import { useEffect, useState } from "react";

const Home = () => {
  const [text, settext] = useState("")
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      settext('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      settext('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);
  return (
    <div className='bg-[#90e0ef] min-h-screen'>
      <div className='my-20'>
        {text}
      </div>
    </div>
  )
}

export default Home