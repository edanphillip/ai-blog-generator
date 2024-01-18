//app/api/gpt/route.ts
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai'
export const runtime = 'edge'
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  console.log("blog stream initiated");
  //collect variables
  const slug = params.slug
  var OPENAI_API_KEY = process.env.OPENAI_API_KEY//? key : process.env.OPENAI_API_KEY;
  let message = slug ? slug : "drone";
  const finetuning = "I need you to only respond to the prompt in markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Be sure to underline, and italicize often to grab attention to important parts. be sure to use h1 h2 h3 h4 tags and others to make text pop. Write a blog post about this topic:"
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
  //call openapi
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert assistant at writing exceptional blog posts" },
      { role: "user", content: `${finetuning}${message}}` },
    ],
    stream: true,
    model: "gpt-3.5-turbo-0613",
    functions: [
      { name: "write", "parameters": schema }
    ],
    function_call: { name: "write" },
    temperature: 0,
  })
  //return output
  const stream = OpenAIStream(completion)
  console.log("blog stream returned");

  return new StreamingTextResponse(stream);
}