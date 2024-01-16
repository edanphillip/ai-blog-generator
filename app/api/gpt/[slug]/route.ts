import OpenAI from "openai";
export async function GET(request: Request, { params }: { params: { slug: string } }) {
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
      blog_ideas: {
        type: "array",
        description: "Provide 5 blog article ideasideas",
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
    let finetuning = "I need you to only respond to the prompt. Generate an array of 5 blog post ideas relating to this topic:  "
    // let finetuning = ""
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert assistant at coming up with blog ideas." },
        { role: "user", content: `${finetuning}${message}}` },
      ],
      model: "gpt-3.5-turbo-0613",
      functions: [
        { name: "get_blog_ideas", "parameters": schema }
      ],
      function_call: { name: "get_blog_ideas" },
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