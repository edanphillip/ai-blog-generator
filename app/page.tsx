//app/page.tsx
'use client'
import { IncomingMessage } from "http";
// import "./air.css"

import { useState } from "react";
import Markdown from "react-markdown";
import { BeatLoader } from "react-spinners";
interface blogidea {
  idea: string,
}
interface blogpost {
  response: string,
}
export default function Home() {
  const [part1IsLoading, setPart1IsLoading] = useState(false);
  const [part2IsLoading, setPart2IsLoading] = useState(false);
  const [blogTopicInput, setBlogTopicInput] = useState('');
  const [blogIdeaList, setBlogIdeaList] = useState<blogidea[]>([])
  const [selectedBlogIdea, setSelectedBlogIdea] = useState("drone")
  const [blogPostText, setBlogPostText] = useState<blogpost>({ response: "" })
  const getblogideas = async () => {
    setPart1IsLoading(true);

    try {
      var url = `/api/gpt/${blogTopicInput}/`
      const { data } = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(data => {
          return data.json()
        }
        )
      console.log("data:", data);
      setBlogIdeaList([...data.blog_ideas])
    } catch (error) {
      console.error(error);
    }

    setPart1IsLoading(false);
    setBlogTopicInput('');

  }
  const writeblog = async (idea: string) => {
    setPart2IsLoading(true);
    try {
      var url = `/api/streamblog/${idea}/`
      const res: Response = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let toDisplayText = ""
      let preDisplayText = ""
      let trimmedBeginning = false
      while (true) {
        try {
          const chunk = await reader?.read();
          const { done, value } = chunk!;
          let decodedChunk = decoder.decode(value);

          //trim beginning of text by sending output to a different variable
          if (!trimmedBeginning) {
            if (decodedChunk.includes(': \\"')) {
              var splitstring = decodedChunk.split(': \\"')
              preDisplayText += splitstring[0]
              decodedChunk = splitstring[1]
              trimmedBeginning = true;
            } else {
              preDisplayText += decodedChunk
              if (done) {
                break;
                throw new Error("wtf homie it didnt work");
              }
              continue;
            }
          }

          // let lines = decodedChunk.split("\\n")
          // //loop until i get the full intro phrase
          // //  variable which keeps all text
          // // append to it then check if it contains 
          // //subtract the intro phase and keep text after it.
          // //loop through as normal
          // const parsedlines = lines.map(line => {
          //   // var parsedline = line.replace('{"function_call": {"name": "write", "arguments": "', "")
          //   //   .replace('\\"response\\": \\"', "")
          //   // toDisplayText = toDisplayText + parsedline;
          //   toDisplayText = toDisplayText + line;
          // }
          toDisplayText = toDisplayText + decodedChunk;
          console.log("chunk:", decodedChunk);
          setBlogPostText({ response: toDisplayText })
          if (done) {
            break;
          }


        } catch (error) {
          console.log(error);

        }

      }

      // try {
      //   let responseOmmited = false;
      //   let concattedstream = "";
      //   const stream = bod as unknown as Strea;
      //   var sentence = "";
      //   var presentence = "";
      //   stream.on('data', (chunk: Buffer) => {
      //     const payloadstring = chunk.toString();
      //     concattedstream += payloadstring;
      //     const payloads = concattedstream.split("\n\n");
      //     const realpayloads = payloadstring.split("\n\n");
      //     //omit response
      //     if (!responseOmmited) {
      //       for (const payload of payloads) {
      //         if (payload.startsWith("data:") && payload.endsWith("}")) {
      //           try {
      //             var newpayload = payload.replace("data: ", "")
      //             const data = JSON.parse(newpayload);
      //             const chunk: undefined | string = data.choices[0].delta?.function_call.arguments;
      //             if (chunk) {
      //               presentence += chunk
      //             }
      //           } catch (error) {
      //             console.error(`Error with JSON.parse and ${payload}.\n${error}`);
      //           }
      //         }
      //       }
      //       if (presentence.includes(`{\n  "response": "`)) {
      //         responseOmmited = true;
      //       }
      //     }
      //     else {
      //       for (const payload of realpayloads) {
      //         if (payload.startsWith("data:") && payload.endsWith("}")) {
      //           try {
      //             var newpayload = payload.replace("data: ", "")
      //             const data = JSON.parse(newpayload);
      //             const chunk: undefined | string = data.choices[0].delta?.function_call?.arguments;
      //             if (chunk) {
      //               sentence += chunk
      //             }
      //           } catch (error) {
      //             console.error(`Error with JSON.parse and ${payload}.\n${error}`);
      //           }
      //         }
      //       }
      //       console.log("Sentence: \n", sentence)
      //       if (concattedstream.includes('[DONE]'))
      //         return;//break from stream
      //     }
      //   });
      //   const jsondata = JSON.parse("{}");
      //   // return jsondata;
      //   console.log(jsondata)
      // } catch (error) {
      //   // return { error };
      //   console.log(error)
      // } 

      // console.log("part2response:",);
      // setPart2Response({ response: sentence! })
    } catch (error) {
      console.error(error);
    }

    setPart2IsLoading(false);
  }
  return (
    <main className={`text-black flex min-h-screen flex-col  content-center w-9/12`}>
      <div className="flex flex-col gap-y-5 w-[100%]">
        {/* PART 1 */}
        <h1>AI Blog Generator</h1>
        <p className="inline-block relative  ">Enter Blog Topic to Generate Blog Article Ideas</p>
        <form action={getblogideas} className="relative ">
          <input className="bg-gray-600 p-2 rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
          <button type="submit" onSubmit={(e) => { e.preventDefault(); getblogideas(); }} className=" border-2 border-blue-400 inline-block align-top h-[100%] m-auto relative w-[20%] min-w-[50px]">Submit</button>
        </form>
        <div className="flex flex-col gap-4 justify-around p-4 border-2 border-white">
          <h2 className="text-xl font-bold">Options:</h2>
          <BeatLoader color="gray" loading={part1IsLoading} />
          {/* <p className="flex " dangerouslySetInnerHTML={{ __html: response }}></p> */}

          {/* PART 2 */}
          <form action={() => writeblog(selectedBlogIdea)} className="relative flex flex-col gap-2 w-[100%]">
            <BeatLoader color="white" className="" loading={part2IsLoading} />
            {blogIdeaList &&
              blogIdeaList.map((item, index) => {
                return (
                  <label key={index} className="" >
                    <input type="radio" name="blogidea" id="radio" onChange={e => setSelectedBlogIdea(e.target.value)} value={item.idea} />
                    {item.idea}
                  </label>)
              })
            }
            <button type="submit" className=" border-2 border-blue-400 inline-block align-top h-[100%] m-auto relative w-[20%] min-w-[50px]">Submit</button>
          </form>
          {/* PART 3*/}
          {/* <Markdown className={"bg-slate-500"}>{blogPost?.response}</Markdown> */}
          <textarea value={blogPostText?.response} className="resize-y text-black min-h-[800px]" onChange={(e) => setBlogPostText({ response: e.target.value })}>
          </textarea>
          <button type="button" className="transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 min-w-[115px]  " onClick={() => { blogPostText.response ? navigator.clipboard.writeText(blogPostText.response) : console.log("nothing to copy"); }}
          >Copy Text</button>
        </div>
      </div>
    </main>
  )
}
