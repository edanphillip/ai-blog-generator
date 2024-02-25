"use client"
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useState } from "react"
interface FAQType { question: string, answer: string | JSX.Element }
const FAQs = () => {
  const faqs: FAQType[] = [
    {
      question: "Is there a free trial?",
      answer: "Yes! We provide 500 tokens for free when you first Sign Up"
    },
    {
      question: "Is there a subscription fee?",
      answer: "Nope! There is no subscription fee to use this app. This is a usage-based service. That means you only get charged for what you use."
    },
    {
      question: "How do I get more tokens?",
      answer: <Link href={"/buytokens"} className="underline font-bold text-blue-600">Click Here</Link>
    },
    {
      question: "Do tokens Expire?",
      answer: "No. Tokens do not expire once they are purchased. However the token shop prices may go up or down based on the price of the AI model or Service you are using."
    },
    {
      question: "What can i get with tokens?",
      answer: "You can get your time back. Use tokens on ai services such as blog article generation, Blog ideas generation "
    },
    {
      question: "How does the app help me generate blog ideas?",
      answer: "The app allows you to input a topic, and it will generate a list of potential blog ideas related to that topic. If you leave the topic blank, it suggests ideas based on a random topic."
    },
    {
      question: "What should I do after generating blog ideas?",
      answer: "Once the ideas are generated, you can choose one that interests you and start writing your blog article with the assistance of an intelligent writing assistant."
    },
    {
      question: "How does the writing assistant work?",
      answer: "As you write your article, the app provides real-time suggestions and assistance, helping you form sentences and develop your thoughts."
    },
    {
      question: "Can I see a preview of my article?",
      answer: "Yes, you can switch between preview and edit modes to see how your article looks in a formatted view or make changes to the text."
    },
    {
      question: "How do I copy my finished work?",
      answer: "Once you're satisfied with your article, you can easily copy the text to your clipboard for further use."
    },
    {
      question: "Are there different writing styles available?",
      answer: "Yes, you can choose different writing styles by selecting options provided by the app to suit your preferences."
    },
    {
      question: "Can I customize the app's interface?",
      answer: "Certainly! The app provides the flexibility to toggle between different sections, offering a customizable and user-friendly experience."
    }
  ]
  const FAQ = (props: FAQType) => {
    const [answerShown, setAnswerShown] = useState(false)
    return (
      <button onClick={() => setAnswerShown(!answerShown)} type="button" aria-expanded="true"
        className=" odd:bg-neutral-100 even:bg-neutral-200 text-neutral-content flex flex-col w-full  ">
        <div className="w-full flex flex-col gap-3  p-4  hover:bg-">
          <div className="flex flex-row justify-between  gap-10 w-full" >
            <span className=" text-lg font-bold">{props.question}</span>
            {!answerShown && <PlusIcon height={32} width={32} />}
            {answerShown && <MinusIcon height={32} width={32} />}
          </div>
          {answerShown && <hr className="bg-neutral-content/10 rounded-full h-[2px]" />}
          <div hidden={!answerShown} className="w-full text-left" >
            <p>{props.answer}</p>
          </div>
        </div >
      </ button>
    )
  }
  return (
    <div className="py-4 flex-col flex gap-4 
    xl:mx-[400px]
    lg:mx-[200px]
    md:mx-[50px]
    mx-[20px]
    ">
      <h2 className="text-center text-4xl font-black ">Frequently Asked Questions</h2>
      <dl className="bg-gray-300 rounded-lg border-2 border-neutral-content overflow-hidden">
        {faqs.map((faq, index) =>
          <FAQ key={index} question={faq.question} answer={faq.answer} />
        )}
      </dl>
    </div>
  )
}

export default FAQs