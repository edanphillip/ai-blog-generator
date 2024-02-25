"use client"
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';
import { useData as useTokens } from '../DataContext';
export interface redactedProduct {
  name: string,
  currency: string,
  price: string,
  priceid: string,
  maxGeneratedGPT4Articles: string,
  maxGeneratedGPT4Ideas: string,
  maxGeneratedGPT3Articles: string,
  maxGeneratedGPT3Ideas: string,
}
export default function PricingPage({ products }: { products: redactedProduct[] }) {
  const { isSignedIn, isLoaded } = useUser();
  const { tokens, updateTokens } = useTokens()
  useEffect(() => {
    if (isSignedIn)
      updateTokens();
  }, [updateTokens, isSignedIn])

  function handleCheckoutClicked(product: redactedProduct) {
    fetch(`/api/checkout_sessions/${product.priceid}`, { method: "POST" })
      .then(res => { res.json() })
  }
  return (
    <div className="  ">
      <div className='flex flex-wrap gap-4   bg-accent text-accent-content card to-accent bg-gradient-to-b   border-2 rounded-3xl  bg-clip-border '>
        <section className="text-gray-700 body-font   ">
          <div className="container px-5 py-14 mx-auto flex flex-wrap">
            <div className="lg:w-1/4 mt-48 hidden lg:block">
              <div className="mx-auto border-t border-gray-300 border-b border-l overflow-hidden">
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start ">Maximum Generated Articles</p>
                <p className="text-gray-900 h-12 text-center px-4 flex items-center justify-start">Maximum Blog Post Ideas</p>
                <p className="bg-gray-100 text-gray-900 h-12 text-center px-4 flex items-center justify-start ">No Sucription Required</p>
              </div>
            </div>
            <div className="flex lg:w-3/4 w-full flex-wrap ">
              {products.map(product =>
                <div key={product.name} className="lg:w-1/3 lg:mt-px w-full mb-10 lg:mb-0 even:bg-white/10  border-neutral lg:border-l-2  rounded-lg lg:rounded-none">
                  <div className="px-2 text-center h-48 flex flex-col items-center justify-center text-black">
                    <h3 className="tracking-widest text-xl font-semibold ">{product.name}</h3>
                    <h2 className="text-5xl text-gray-900 font-medium leading-none mb-4 mt-2">{product.price.split(".")[0]}
                      <span className="text-base text-gray-600"> {product.currency.toUpperCase()}</span></h2>
                  </div>
                  <p className="bg-gray-100 text-gray-600 h-12 text-center px-2 flex items-center -mt-px justify-center border-t border-gray-300">{product.maxGeneratedGPT3Articles}</p>
                  <p className="text-gray-600 text-center h-12 flex items-center justify-center">
                    {product.maxGeneratedGPT3Ideas}
                  </p>
                  <p className="bg-gray-100 text-gray-600 text-center h-12 flex items-center justify-center">
                    <span className="w-5 h-5 inline-flex items-center justify-center bg-gray-500 text-white rounded-full flex-shrink-0">
                      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" className="w-3 h-3" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                    </span>
                  </p>
                  <div className="pt-2 flex items-center justify-center">
                    <Link href={`/api/checkout_sessions/${product.priceid}`} className='min-w-fit w-[80%] btn ' onClick={() => handleCheckoutClicked(product)}>Purchase</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div >
  );
}