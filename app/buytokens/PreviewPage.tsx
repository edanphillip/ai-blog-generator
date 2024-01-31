"use client"
import { useEffect } from 'react';
import { RingLoader } from 'react-spinners';
import { useData as useTokens } from '../DataContext';
import { CurrencyCode, getCurrencyCodeSymbol } from '../components/getCurrencyCodeSymbol';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.import React from 'react';  
export interface redactedProduct {
  name: string,
  currency: string,
  price: string,
  priceid: string,
}
export default function PreviewPage({ products }: { products: redactedProduct[] }) {
  const { tokens, updateTokens } = useTokens()
  useEffect(() => {
    updateTokens();
  }, [updateTokens])

  function handleCheckoutClicked(product: redactedProduct) {
    fetch(`/api/checkout_sessions/${product.priceid}`, { method: "POST" }).then(res => { res.json() })
  }
  return (
    <div className="flex flex-col justify-self-stretch h-full  justify-center overflow-clip bg-clip-border">
      <div className="bg-primary self-center p-2 rounded-lg justify-center w-fit mb-4">
        {tokens && <h1 className='text-2xl  text-center text-primary-content'> You have <span className={tokens < 5000 ? "text-orange-600" : tokens < 1000 ? "text-red" : "text-green-300"}>{tokens}</span> tokens remaining. </h1>}
        {!tokens && <RingLoader loading size={18} color={"gold"} />}

      </div>
      <div className='flex flex-wrap gap-4 justify-center overflow-clip bg-clip-border'>
        {products.map(product =>
          <form key={product.priceid} action={`/api/checkout_sessions/${product.priceid}`} method="post" className='bg-accent text-accent-content card card-bordered to-accent bg-gradient-to-b  from-neutral-100 border-2 rounded-3xl  bg-clip-border '>
            <div className='max-w-[600px] flex flex-col gap-4 justify-center   p-4'>
              <h1 className='text-2xl card-title'> {product.name}</h1>
              <div className='text-2xl text-center font-black card-body'>{product.price + "" + getCurrencyCodeSymbol(product.currency.toUpperCase() as CurrencyCode)}</div>
              <button type='submit' onClick={() => handleCheckoutClicked(product)} role="link" className='btn btn-secondary bg-gradient-radial border-none from-primary p-0 m-0  '>
                Buy Now
              </button>
            </div>
            <h1 className='font-bold'></h1>
          </form>
        )}
      </div>
    </div >
  );
}