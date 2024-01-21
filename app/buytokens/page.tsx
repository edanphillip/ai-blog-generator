import NavBar from "../components/NavBar";
import PreviewPage from "./PreviewPage";

const page = async () => {
  "use server"
  return (
    <div className='bg-[#90e0ef] min-h-screen'>
      <NavBar />
      <div className='my-20'>
        <PreviewPage />
        <stripe-pricing-table pricing-table-id="prctbl_1OafFqA6ywKF9vUQNc1gX8Mh"
          publishable-key="pk_live_51OaJa0A6ywKF9vUQUKFe4e9XwZlv3wMdP2Z0PRv1tP7gTyjybslkRAo0zPUb1yOCDB6MlZ79EM3BEOdcB91iDWWp00593ofXiA">
        </stripe-pricing-table>
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