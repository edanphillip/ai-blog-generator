//app/api/gpt/route.ts
import addTokenTransaction from "@/app/lib/addTokenTransaction";
import checkIfSufficientTokens from "@/app/lib/checkIfSufficientTokens";
import getTokenShopPrice from "@/app/lib/getprices";
import { acceptedStreamModels } from "@/app/types";
import { currentUser } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from "openai";
export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: { prompt: string, model: acceptedStreamModels } }) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  try {
    //validation
    const { prompt, model } = params;
    if (!prompt) return error("Invalid Params", 401)
    const user = await currentUser();
    if (!user) return error("Invalid User", 401)
    let userCanAfford = await checkIfSufficientTokens({ model, service: "article" }, user);
    if (!userCanAfford) { return error("Insufficient Tokens", 401) }
    request.signal.onabort = () => {
      completion.controller.abort();
      console.log("abort request processed")
    };
    //initiation
    console.log("blog stream initated for ", user.firstName);
    const completion = await streamBlog(prompt)
    let tokensUsed = getTokenShopPrice({ model, service: "article" })
    //add transaction to database 
    addTokenTransaction({ tokensUsed, clerkID: user.id, userPrompt: prompt })
    //return output
    const stream = OpenAIStream(completion)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("error streaming api response: ", error)
    return Response.json({ stream: null, error }, { status: 400 })
  }
}

const streamBlog = (prompt: string, model: "gpt-4-1106-preview" | "gpt-3.5-turbo-16k-0613" = "gpt-3.5-turbo-16k-0613") => {
  console.log("blog stream initiated");
  //collect variables
  var OPENAI_API_KEY = process.env.OPENAI_API_KEY//? key : process.env.OPENAI_API_KEY;
  let message = prompt ? prompt : "drone";
  let maxlength = process.env.maxBlogLength ? process.env.maxBlogLength : 0;
  const finetuning = `Write an engaging blog post on the specified topic using Markdown format. Only respond to the prompt in Markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Incorporate underlined and italicized text strategically for emphasis. DONT write comments in the output. Utilize h1, h2, h3, h4 markdown tags, and other tags to enhance visual appeal and separate sections logically. Maintain a natural and human-like tone, avoiding a typical AI-generated style. Emphasize burstiness, dont shy from perplexity, and vary the temperature to achieve a more authentic feel. Try to make the blog post around ${maxlength} words. Craft this post around the topic that follows this semi-colon:`
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
  const completion = openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are an expert assistant that writes exceptional blog posts" },
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
  return completion
}

