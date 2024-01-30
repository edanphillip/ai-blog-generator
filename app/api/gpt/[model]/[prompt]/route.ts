import addTokenTransaction from "@/app/lib/addTokenTransaction";
import checkIfSufficientTokens from "@/app/lib/checkIfSufficientTokens";
import getTokenShopPrice from "@/app/lib/getprices";
import { acceptedStreamModels } from "@/app/types";
import { currentUser } from "@clerk/nextjs";
import OpenAI from "openai";
export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: { prompt: string, model: acceptedStreamModels } }) {
  const error = (message: string, status = 400) => { return Response.json({ message: message }, { status: status }) }
  //validation
  const { prompt, model } = params;
  const service = "blogpostideas"
  if (!prompt) return error("Invalid Params", 401)
  const user = await currentUser();
  if (!user) return error("Invalid User", 401)
  let userCanAfford = await checkIfSufficientTokens({ model, service }, user);
  if (!userCanAfford) { return error("Insufficient Tokens", 401) }
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) error("Invalid api key", 500)

  //TODO:protect endpoint
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  let message = prompt ? prompt : "drone";
  const schema = {
    type: "object",
    properties: {
      blog_ideas: {
        type: "array",
        description: "Provide 5 blog article ideas",
        items: {
          type: "object",
          properties: {
            idea: {
              type: "string",
              description: "blog idea example title",
            }
          }
        }
      },
    },
    required: ["blog_ideas"]
  }
  //add transaction to database 
  if (userCanAfford) {
    // let finetuning = "I need you to only respond to the prompt in markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Generate 5 blog post ideas relating to this topic:  "
    let finetuning = "I need you to only respond to the topic i will give you. Generate an array of 5 blog post ideas relating to the topic. Try to vary your interpretation of the topic if you can. Minimize placeholder text here is the topic:"
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert assistant at coming up with blog ideas." },
        { role: "user", content: `${finetuning}${message}}` },
      ],
      model: model,
      functions: [
        { name: "get_blog_ideas", "parameters": schema }
      ],
      function_call: { name: "get_blog_ideas" },
      temperature: 1,
    });
    // request.signal.onabort = () => {
    //   completion.controller.abort();
    //   console.log("abort request processed")
    // };
    // TODO: convert this to a streaming input
    console.log(completion.choices[0].message.function_call?.arguments);
    console.log(completion);
    let tokensUsed = getTokenShopPrice({ model, service })
    const jsondata = JSON.parse(completion.choices[0].message.function_call?.arguments!);
    addTokenTransaction({ tokensUsed, clerkID: user.id, userPrompt: prompt })
    const data = jsondata
    return Response.json({ data, error: null })
  } else {
    return error("Insufficient Tokens", 401)
  }
}