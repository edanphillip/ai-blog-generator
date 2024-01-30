import gettokens from "@/app/api/getTokens/gettokens";
import addTokenTransaction from "@/app/lib/addTokenTransaction";
import error from "@/app/lib/errorHandler";
import getTokenShopPrice from "@/app/lib/getprices";
import { acceptedStreamModels } from "@/app/types";
import { currentUser } from "@clerk/nextjs";
import OpenAI from "openai";
export const maxDuration = 20; // This function can run for a maximum of x seconds
export const dynamic = 'force-dynamic';
export async function GET(request: Request, { params }: { params: { prompt: string, model: acceptedStreamModels } }) {
  const { prompt, model } = params
  const signal = request.signal
  //TODO:protect endpoint
  var OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) error("Invalid api key", 500)
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  console.log("api hit");
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
  const clerkUser = await currentUser()

  if (!clerkUser) return error("Invalid User")
  let serviceTokensCost = 0
  let userTokensAvailable = await gettokens();
  if (userTokensAvailable == null)
    return error("Error getting tokens.", 401)
  serviceTokensCost = getTokenShopPrice({ model, service: "blogpostideas" })
  let userCanAfford: boolean = userTokensAvailable >= serviceTokensCost
  //add transaction to database 
  if (userCanAfford) {
    async function main() {
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
      console.log(completion.choices[0].message.function_call?.arguments);
      console.log(completion);
      const jsondata = JSON.parse(completion.choices[0].message.function_call?.arguments!);
      return jsondata;
    }
    addTokenTransaction({ tokensUsed: serviceTokensCost, clerkID: clerkUser.id, userPrompt: prompt })
    const data = await main();
    return Response.json({ data, error: null })
  } else {
    return error("Insufficient Tokens", 401)
  }
}