import Stripe from "stripe";

export default async function getproducts() {

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
  if (!stripe) return []
  var productList = await stripe.products.list({ expand: ["data.default_price"], active: true })
  return productList.data || [];

}