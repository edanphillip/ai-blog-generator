import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { Instructions } from "./components/Instructions";
import FAQs from "./faq/Faq";

const page = () => {
  return (
    <main className=' h-fit'>
      <div className="flex flex-col gap-4">
        <Hero />
        {/* <Demo />
        <Testimonials />
        <CompetitorComparison /> */}
        <FAQs />
        <Instructions />
      </div >
      <Footer />
    </main>
  )
}

export default page