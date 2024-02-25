import { redactedProduct } from "../components/PricingPage";

// export default async function getproducts() {

//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { typescript: true });
//   if (!stripe) return []
//   var productList = await stripe.products.list({ expand: ["data.default_price"], active: true })
//  return productList.data || []; 
// }
export default function getproducts() {
  let retrievedProducts: redactedProduct[] = [
    {
      priceid: process.env.priceid_1000 as string,
      name: "1000 Tokens",
      currency: "$",
      maxGeneratedGPT3Ideas: "100 Topics",
      maxGeneratedGPT3Articles: "1000 Articles",
      maxGeneratedGPT4Ideas: "50 Topics",
      maxGeneratedGPT4Articles: "5 Articles",
      price: (500 / 100).toFixed(2),
    },
    {
      priceid: process.env.priceid_5000 as string,
      maxGeneratedGPT3Ideas: "500 Topics",
      maxGeneratedGPT3Articles: "5000 Articles",
      maxGeneratedGPT4Ideas: "330 Topics",
      maxGeneratedGPT4Articles: "33 Articles",
      name: "5000 Tokens",
      currency: "$",
      price: (1000 / 100).toFixed(2),
    },
    {
      priceid: process.env.priceid_15000 as string,
      maxGeneratedGPT3Ideas: "15000 Topics",
      maxGeneratedGPT3Articles: "1500 Articles",
      maxGeneratedGPT4Ideas: "1000 Topics",
      maxGeneratedGPT4Articles: "100 Articles",
      name: "15000 Tokens",
      currency: "$",
      price: (2000 / 100).toFixed(2),
    },
  ]
  return retrievedProducts;
}