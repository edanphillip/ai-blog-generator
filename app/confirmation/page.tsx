import NavBar from "../components/NavBar";

const page = async () => {
  return (
    <div className='bg-[#90e0ef] h-screen'>
      <NavBar />
      <div className='my-20'>
        YOU WIN payment success
      </div>
    </div>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default page