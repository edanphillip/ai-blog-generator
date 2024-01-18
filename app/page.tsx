//app/page.tsx
'use client'
import { IncomingMessage } from "http";
// import "./air.css"
import useAutosizeTextArea from "./useAutosizeTextArea";

import { useState, useRef } from "react";
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
  const [blogPostText, setBlogPostText] = useState("")

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, blogPostText);


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
    setBlogPostText("")
    try {
      var url = `/api/streamblog/${idea}/`
      const res: Response = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      console.log("blog stream recieved")
      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let preDisplayText = ""
      let toDisplayText = ""
      let trimmedBeginning = false
      while (true) {
        try {
          const chunk = await reader?.read();
          const { done, value } = chunk!;
          let decodedChunk = decoder.decode(value);

          //trim beginning of text  
          if (!trimmedBeginning) {
            //send all data to 1st pre-display variable
            preDisplayText += decodedChunk;
            //check if the characters that come before the actual response have been rendered
            if (preDisplayText.includes(': \\"')) {
              //when found, switch bugget and add the split pre-display to respective buckets
              trimmedBeginning = true
              var splitstring = preDisplayText.split(': \\"')
              preDisplayText = splitstring[0]
              toDisplayText = splitstring[1];
              continue;
              //break if done somehow.. shouldnt be possible if normal response is recieved
            } else {
              if (done) {
                break;
              }
            }
            continue;
          }
          //then everything to 2nd bucket 
          toDisplayText = toDisplayText + decodedChunk;
          console.log("chunk:", decodedChunk);
          if (toDisplayText.includes("\\n")) {
            const newtext = toDisplayText.replace(/\\\\n/g, '\n')
              .replace(/\\\\"\\\\n\}\"\}\}/g, '');
            toDisplayText = newtext;
          }
          if (done) {
            // Find the index of the last period
            const lastPeriodIndex = toDisplayText.lastIndexOf('.');
            // Extract the substring up to the last period
            toDisplayText = toDisplayText.slice(0, lastPeriodIndex + 1);
            setBlogPostText(toDisplayText)
            break;
          }
          setBlogPostText(toDisplayText)
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
    <main className={`text-black flex min-h-screen flex-col  content-center px-10 `}>
      <div className="flex flex-col gap-y-5 w-[100%] ">
        {/* PART 1 */}
        <h1 className="text-xl text-center text-primary-400
        md:text-6xl sm:text-4xl">AI Blog Generator</h1>
        <p className="inline-block relative font-semibold text-center ">Enter Blog Topic to Generate Blog Article Ideas</p>
        <form action={getblogideas} className="relative flex flex-col">
          <input className="border-2 border-gray-400 bg-white p-2 rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
          <button
            type="submit"
            onSubmit={(e) => { e.preventDefault(); getblogideas(); }}
            className="transform  rounded-md bg-primary-600/95 px-5 py-3 my-2 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 w-100%  "
          >Submit</button>
        </form>

        {/* PART 2 */}
        <div className="flex flex-col gap-4 justify-around p-4 border-2 border-white w-full bg-gray-50  ">
          {/* <p className="flex " dangerouslySetInnerHTML={{ __html: response }}></p> */}

          <div className="flex flex-col gap-4 md:flex-row  w-[100%]">

            <form action={() => writeblog(selectedBlogIdea)} className=" flex w-[100%] flex-col gap-2 ">
              <p className="inline-block font-semibold">Select a blog topic then generate the article using AI</p>
              <BeatLoader color="gray" loading={part1IsLoading} />
              <BeatLoader color="red" className="" loading={part2IsLoading} />
              {blogIdeaList &&
                blogIdeaList.map((item, index) => {
                  return (
                    <label key={index} className="" >
                      <input type="radio" name="blogidea" id="radio" onChange={e => setSelectedBlogIdea(e.target.value)} value={item.idea} />
                      {item.idea}
                    </label>)
                })
              }
              <button type="submit" className=" transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300  ">Generate</button>
            </form>
            {/* PART 3*/}
            <div className="w-[100%] h-[680px]  text-center flex flex-col gap-2">
              {/* <Markdown className={"bg-slate-500"}>{blogPost?.response}</Markdown> */}
              <textarea id="textarea"
                className="border-2 min-h-48 border-gray-400 rounded-xl  bg-gray-200 max-h-full resize-y w-[100%] text-black "
                ref={textAreaRef}
                onInput={(e) => {
                  e.currentTarget.style.height = ""; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
                }} value={blogPostText}
                onChange={(e) => {
                  e.currentTarget.style.height = ""; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                  setBlogPostText(e.target.value)
                }}
              >
              </textarea>
              <button type="button" className="transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 " onClick={() => { blogPostText ? navigator.clipboard.writeText(blogPostText) : console.log("nothing to copy"); }}
              >Copy Text</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
