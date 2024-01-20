'use client'
const CallToActionButton = ({ className: classname = "", cta = "Purchase Tokens" }: { cta?: string, className?: string }) => {
  return (<button onClick={() => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) }} className={"border-2 border-gray-500 transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90 hover:text-primaryText-dark  duration-300 min-w-[115px]  " + classname}>
    {cta}
  </button>
  )
}

export default CallToActionButton