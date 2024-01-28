import addTokenTransaction from "@/app/lib/addTokenTransaction";
import error from "@/app/lib/errorHandler";
import { acceptedStreamModels } from "@/app/types";
import { currentUser } from "@clerk/nextjs";
import OpenAI from "openai";
export async function GET(request: Request, { params }: { params: { prompt: string, model: acceptedStreamModels } }) {
  const { prompt, model } = params
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

  async function main() {
    // let finetuning = "I need you to only respond to the prompt in markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Generate 5 blog post ideas relating to this topic:  "
    let finetuning = "I need you to only respond to the topic i will give you. Generate an array of 5 blog post ideas relating to the topic. Try to vary your interpretation of the topic if you can. Minimize placeholder text here is the topic:"
    // let finetuning = ""
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
  let tokensUsed = 0
  switch (model) {
    case "gpt-3.5-turbo-16k-0613":
      tokensUsed = 1
      break;
    case "gpt-4-1106-preview":
      tokensUsed = 15
      break;
  }
  //add transaction to database
  const clerkUser = await currentUser()
  if (!clerkUser) return error("Invalid User")

  addTokenTransaction({ tokensUsed, clerkID: clerkUser.id, userPrompt: prompt })
  const data = await main();

  return Response.json({ data })
}