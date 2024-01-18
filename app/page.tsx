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
  const [part1HasLoaded, setPart1HasLoaded] = useState(false);
  const [part2HasLoaded, setPart2HasLoaded] = useState(false);
  const [part2IsLoading, setPart2IsLoading] = useState(false);
  const [blogTopicInput, setBlogTopicInput] = useState('');
  const [blogIdeaList, setBlogIdeaList] = useState<blogidea[]>([])
  const [selectedBlogIdea, setSelectedBlogIdea] = useState("drone")
  const [blogPostText, setBlogPostText] = useState("")
  const [showPreview, setShowPreview] = useState(true)

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, blogPostText);

  const [errorList, seterrorList] = useState<string[]>([])
  const getblogideas = async () => {
    setPart1IsLoading(true);
    setPart1HasLoaded(false);
    setBlogIdeaList([]);
    var query = blogTopicInput ? blogTopicInput : null;
    if (!query) {
      errorList.push("Invalid Query: " + query)
      return;
    };
    const generate = async () => {
      try {
        var url = `/api/gpt/${query}/`
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
        errorList.push(error as string)
      }
    }
    await generate();
    setPart1IsLoading(false);
    setPart1HasLoaded(true);
    seterrorList([])
    setBlogTopicInput('');

  }
  const writeblog = async (idea: string) => {
    setPart2IsLoading(true);
    setPart2HasLoaded(false);
    setBlogPostText("")

    const generate = async () => {
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
      } catch (error) {
        console.error(error);
      }
    }
    await generate();
    setPart2HasLoaded(true);
    setPart2IsLoading(false);
  }

  return (
    <main className={`text-black flex min-h-screen flex-col  content-center px-10 `}>

      <div className="flex flex-col gap-y-2 w-[100%] ">
        <h1 className="text-xl text-center text-primary-400
        md:text-6xl sm:text-4xl">AI Blog Generator</h1>

        <div className="flex flex-row gap-4 justify-around p-4 border-2 border-white w-full bg-gray-50  ">
          <div className="flex flex-col gap-y-2 w-[100%] ">

            <p className="inline-block relative font-semibold text-center ">Enter Blog Topic to Generate Blog Article Ideas</p>
            {/* PART 1 */}
            <form action={getblogideas} className="relative flex flex-col">
              {errorList.map((err, index) => {
                return <p key={index} className="text-red-400 text-md text-center bg-red-50 border-2 px-3 py-1 rounded-sm">
                  {err}
                </p>
              })}
              <input className="border-2 border-gray-400 bg-white p-2 rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
              <button
                type="submit"
                onSubmit={(e) => { e.preventDefault(); getblogideas(); }}
                className="transform  rounded-md bg-primary-600/95 px-5 py-3 my-2 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 w-100%  "
              >Generate Article Ideas</button>
            </form>
            {/* PART 2 */}
            <form action={() => writeblog(selectedBlogIdea)} className=" flex w-[100%] flex-col gap-2 ">
              <p className="inline-block font-semibold">Select a blog topic then generate the article using AI</p>
              <BeatLoader color="gray" loading={part1IsLoading} />
              <BeatLoader color="red" className="" loading={part2IsLoading} />
              {blogIdeaList &&
                blogIdeaList.map((item, index) => {
                  return (
                    <label key={index} className="flex flex-row gap-2" >
                      <input type="radio" name="blogidea" id="radio" onChange={e => setSelectedBlogIdea(e.target.value)} value={item.idea} />
                      {item.idea}
                    </label>)
                })
              }
              <button type="submit"
                disabled={!part1HasLoaded}
                className="transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 disabled:bg-slate-300">Write Article</button>
            </form>
          </div>
          <div className="flex flex-col gap-4 md:flex-row  w-[100%]">
            {/* PART 3*/}
            <div className="w-[100%] h-[680px]  text-center flex flex-col gap-2">
              <div className="togglePreview flex flex-row w-[100%]">
                <button
                  className={"transition-colors inline-block bg-gray-100 text-xl px-auto w-full py-2 border-2 hover:border-primary-700  border-r-0 hover:bg-primary-600 rounded-tl-xl justify-center" + (showPreview ? "border-primary-700 bg-primary-600" : "")}
                  onClick={() => setShowPreview(true)}>
                  Preview
                </button>
                <button
                  className={"transition-colors inline-block bg-gray-100 text-xl px-auto w-full py-2 border-2 border-l-0 hover:border-primary-700 hover:bg-primary-600 rounded-tr-xl justify-center" + (!showPreview ? "border-primary-700 bg-primary-600" : "")}
                  onClick={() => setShowPreview(false)}>
                  Edit
                </button>
              </div>

              {showPreview ? <Markdown className={"prose w-[100%]lg:prose-xl border-2 min-h-48 border-gray-400 rounded-b-xl overflow-scroll bg-gray-100 max-h-full resize-y  text-black "}>
                {blogPostText}
              </Markdown> :
                <textarea id="textarea"
                  className="border-2 min-h-48 border-gray-400 rounded-b-xl   bg-gray-200 max-h-full resize-y w-[100%] text-black "
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
              }
              <button type="button" disabled={!part2HasLoaded} className="disabled:bg-slate-300  transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 " onClick={() => { blogPostText ? navigator.clipboard.writeText(blogPostText) : console.log("nothing to copy"); }}
              >Copy Text</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
