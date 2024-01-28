import PreviewPage, { redactedProduct } from "./PreviewPage";
import getproducts from "../lib/getproducts";
import Stripe from "stripe";

const page = async () => {
  "use server"
  var products = await getproducts();

  let redactedProducts: redactedProduct[] = [];
  let i = 0;
  for (i = 0; i < products.length; i++) {
    const stripeProduct = products[i];
    const default_price = stripeProduct.default_price! as Stripe.Price
    const price = default_price.unit_amount!

    redactedProducts.push({
      priceid: default_price.id,
      name: stripeProduct.name,
      currency: default_price.currency,
      price: (price / 100).toFixed(2),
    })
  }


  return (
    <div className='self-stretch h-screen bg-accent bg-gradient-to-tr from-accent to-primary overflow-y-clip'>
      <div>
        <PreviewPage products={redactedProducts} />
      </div>
    </div>
  )
}

export default page