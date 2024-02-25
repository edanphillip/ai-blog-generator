import Footer from "../components/Footer";
import PricingPage from "../components/PricingPage";
import getproducts from "../lib/getproducts";

const page = async () => {
  "use server"
  let redactedProducts = getproducts();

  // var products = await getproducts();
  // let i = 0;
  // for (i = 0; i < products.length; i++) {
  //   const stripeProduct = products[i];
  //   const default_price = stripeProduct.default_price! as Stripe.Price
  //   const price = default_price.unit_amount!

  //   redactedProducts.push({
  //     priceid: default_price.id,
  //     name: stripeProduct.name,
  //     currency: default_price.currency,
  //     price: (price / 100).toFixed(2),
  //   })
  // }


  return (
    <div className='  h-screen bg-accent bg-gradient-to-tr from-accent to-primary  '>
      <PricingPage products={redactedProducts} />
      <Footer />
    </div>
  )
}

export default page