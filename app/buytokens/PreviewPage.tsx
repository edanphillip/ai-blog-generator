"use client"
import React from 'react'
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.import React from 'react'; 
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function PreviewPage() {

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <form action="/api/checkout_sessions" method="POST">
      <section>
        <button type="submit" role="link" className='hover:bg-primary-900 bg-primary-700  rounded-md block  duration-200 text-center py-2 pr-4 pl-3 border-b min-w-[100px] min-h-[30px] items-center text-lg font-medium text-primaryText-light md:hover:text-primary-300 border-primary-200/20   md:border- md:text-black transform hover:font-semibold transition-all hover:from-primary-500 from-primary-700  bg-primary-600/95 px-4  text-primaryText-light    '>
          Checkout
        </button>
      </section>
    </form>
  );
}