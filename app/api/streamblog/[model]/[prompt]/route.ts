//app/api/gpt/route.ts
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { currentUser } from "@clerk/nextjs";
import addTokenTransaction from "@/app/lib/addTokenTransaction";
import { acceptedStreamModels } from "@/app/types";
import getTokenShopPrice from "@/app/lib/getprices";
export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: { prompt: string, model: acceptedStreamModels } }) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  try {
    const { prompt, model } = params;
    const user = await currentUser();
    if (!user) return error("Invalid User", 401)
    const clerkID = user.id
    console.log("blog stream initated for ", user.firstName);
    if (!prompt) return error("Invalid Params", 401)
    const userPrompt = prompt
    const stream = await streamBlog(userPrompt)
    const stream_client = stream
    let tokensUsed = getTokenShopPrice({ model, service: "article" })
    //add transaction to database
    addTokenTransaction({ tokensUsed, clerkID, userPrompt })
    return new StreamingTextResponse(stream_client)
  } catch (error) {
    console.error("error streaming api response: ", error)
    return Response.json({ stream: null, error }, { status: 400 })
  }
}
const streamBlog = async (prompt: string, model: "gpt-4-1106-preview" | "gpt-3.5-turbo-16k-0613" = "gpt-3.5-turbo-16k-0613") => {

  console.log("blog stream initiated");
  //collect variables
  var OPENAI_API_KEY = process.env.OPENAI_API_KEY//? key : process.env.OPENAI_API_KEY;
  let message = prompt ? prompt : "drone";
  let maxlength = process.env.maxBlogLength ? process.env.maxBlogLength : 0;
  const finetuning = `Write an engaging blog post on the specified topic using Markdown format. Only respond to the prompt in Markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Incorporate underlined and italicized text strategically for emphasis. DONT write comments in the output. Utilize h1, h2, h3, h4 markdown tags, and other tags to enhance visual appeal and separate sections logically. Maintain a natural and human-like tone, avoiding a typical AI-generated style. Emphasize burstiness, dont shy from perplexity, and vary the temperature to achieve a more authentic feel. Ensure the blog post remains under ${maxlength} words. Craft the post around this topic:`
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
    model: model,
    functions: [
      { name: "write", parameters: schema }
    ],
    function_call: { name: "write" },
    temperature: 1,
  })
  //return output
  const stream = OpenAIStream(completion)
  return stream
}
async function calculateTokensUsed(stream: ReadableStream) { //for internal usage. user token prices is static
  const decoder = new TextDecoder("utf-8");
  const reader = stream.getReader()
  let looperrorcount = 0
  let tokens_used = 0
  let fulltext = ""
  while (true && looperrorcount < 3) {
    try {
      const chunk = await reader?.read();
      const { done, value } = chunk!;
      // calculate tokens used
      const decodedvalue = decoder.decode(value)
      tokens_used += decodedvalue?.length ? decodedvalue.length / 4 : 0
      if (done) break;
    } catch (error) {
      looperrorcount++;
      console.error(error);
      break;
    }
  }
  console.log("openai_response_tokens:", tokens_used)
  return tokens_used;
}