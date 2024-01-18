//app/api/gpt/route.ts
import { IncomingMessage } from "http";
import OpenAI from "openai";
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug // 'a', 'b', or 'c'
  // const apiKey= params.apiKey // 'a', 'b', or 'c'
  // var key = headers().get("x-api-key")
  // var OPENAI_API_KEY = key! //? key : process.env.OPENAI_API_KEY; 
  console.log("api hit");
  let message = slug ? slug : "drone";


  const schema = {
    type: "object",
    properties: {
      response: {
        type: "string",
        description: "Get the sentence markdown format",
      },
    },
    required: ["response"]
  }
  // const schema = {
  //   type: "object",
  //   properties: {
  //     response: {
  //       type: "string",
  //       description: "Get the blog post in markdown format",
  //     },
  //   },
  //   required: ["response"]
  // }



  async function main() {
    var OPENAI_API_KEY = process.env.OPENAI_API_KEY//? key : process.env.OPENAI_API_KEY; 
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    try {
      let finetuning = "I need you to only respond to the prompt in markdown format. DO NOT precede the markdown with any text nor follow the markdown with any more text. Write a sentence about this topic:"
      // let finetuning = "I need you to only respond to the prompt. Generate an array of 5 blog post ideas relating to this topic:  "
      // const completion = await openai.chat.completions.create({
      //   messages: [
      //     { role: "system", content: "You are an expert assistant at writing exceptional blog posts." },
      //     { role: "user", content: `${finetuning}${message}}` },
      //   ],
      //   model: "gpt-3.5-turbo-0613",
      //   functions: [
      //     { name: "write_blog", "parameters": schema }
      //   ],
      //   function_call: { name: "write_blog" },
      //   temperature: 0,
      // }) 
      const completion = openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an expert assistant at writing exceptional paragraph-log summaries" },
          { role: "user", content: `${finetuning}${message}}` },
        ],
        stream: true,
        model: "gpt-3.5-turbo-0613",
        functions: [
          { name: "write", "parameters": schema }
        ],
        function_call: { name: "write" },
        temperature: 0,
      }).asResponse()

      let responseOmmited = false;
      let concattedstream = "";
      const stream = (await completion).body as unknown as IncomingMessage;
      var sentence = "";
      var presentence = "";
      stream.on('data', (chunk: Buffer) => {
        const payloadstring = chunk.toString();
        concattedstream += payloadstring;
        const payloads = concattedstream.split("\n\n");
        const realpayloads = payloadstring.split("\n\n");
        //omit response
        if (!responseOmmited) {
          for (const payload of payloads) {
            if (payload.startsWith("data:") && payload.endsWith("}")) {
              try {
                var newpayload = payload.replace("data: ", "")
                const data = JSON.parse(newpayload);
                const chunk: undefined | string = data.choices[0].delta?.function_call.arguments;
                if (chunk) {
                  presentence += chunk
                }
              } catch (error) {
                console.error(`Error with JSON.parse and ${payload}.\n${error}`);
              }
            }
          }
          if (presentence.includes(`{\n  "response": "`)) {
            responseOmmited = true;
          }
        }
        else {
          for (const payload of realpayloads) {
            if (payload.startsWith("data:") && payload.endsWith("}")) {
              try {
                var newpayload = payload.replace("data: ", "")
                const data = JSON.parse(newpayload);
                const chunk: undefined | string = data.choices[0].delta?.function_call?.arguments;
                if (chunk) {
                  sentence += chunk
                }
              } catch (error) {
                console.error(`Error with JSON.parse and ${payload}.\n${error}`);
              }
            }
          }
          console.log("Sentence: \n", sentence)
          if (concattedstream.includes('[DONE]'))
            return;//break from stream
        }
      });

      // console.log(completion.choices[0].message.function_call?.arguments);
      // console.log(completion);
      // const jsondata = JSON.parse(completion.choices[0].message.function_call?.arguments!);
      const jsondata = JSON.parse("{}");
      return jsondata;
    } catch (error) {
      return { error };
    }
  }
  const data = await main();

  return Response.json({ data })
}