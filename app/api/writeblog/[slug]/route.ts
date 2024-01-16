//app/api/gpt/route.ts
import model from "@/app/models";
import { headers } from 'next/headers'
import { NextApiRequest } from "next";
import OpenAI from "openai";
export async function GET(request: NextApiRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug // 'a', 'b', or 'c'
  // const apiKey= params.apiKey // 'a', 'b', or 'c'
  // var key = headers().get("x-api-key")
  // var OPENAI_API_KEY = key! //? key : process.env.OPENAI_API_KEY; 
  var OPENAI_API_KEY = process.env.OPENAI_API_KEY//? key : process.env.OPENAI_API_KEY; 
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  console.log("api hit");
  let message = slug ? slug : "drone";


  const schema = {
    type: "object",
    properties: {
      response: {
        type: "string",
        description: "Get the blog post in markdown format",
      },
    },
    required: ["response"]
  }



  async function main() {
    let finetuning = "I need you to only respond to the prompt in markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Write a blog post about this topic:  "
    // let finetuning = "I need you to only respond to the prompt. Generate an array of 5 blog post ideas relating to this topic:  "
    // let finetuning = ""
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert assistant at writing exceptional blog posts." },
        { role: "user", content: `${finetuning}${message}}` },
      ],
      model: "gpt-3.5-turbo-0613",
      functions: [
        { name: "write_blog", "parameters": schema }
      ],
      function_call: { name: "write_blog" },
      temperature: 0,
    });
    console.log(completion.choices[0].message.function_call?.arguments);
    console.log(completion);
    const jsondata = JSON.parse(completion.choices[0].message.function_call?.arguments!);
    return jsondata;
  }
  const data = await main();

  return Response.json({ data })
}