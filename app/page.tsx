//app/page.tsx
'use client'
import { StreamingTextResponse } from "ai";
// import "./air.css"
import useAutosizeTextArea from "./useAutosizeTextArea";

import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { BeatLoader } from "react-spinners";
interface blogidea {
  idea: string,
}
export default function Home() {
  const [blogIdeasLoading, setBlogIdeasLoading] = useState(false);
  const [blogIdeasLoaded, setBlogIdeasLoaded] = useState(false);
  const [blogDoneWriting, setBlogDoneWriting] = useState(true);
  const [mainSectionHidden, setMainSectionHidden] = useState(false);
  const [blogTopicInput, setBlogTopicInput] = useState('');
  const [blogIdeaList, setBlogIdeaList] = useState<blogidea[]>([])
  const [selectedBlogIdea, setSelectedBlogIdea] = useState<string | null>()
  const [blogPostText, setBlogPostText] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const [controller, setController] = useState<AbortController | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, blogPostText);

  const [errorList, seterrorList] = useState<string[]>([])
  const getblogideas = async () => {
    let controller = (new AbortController())
    setController(controller)
    let errors: string[] = []
    seterrorList(errors)
    var signal = controller.signal

    setBlogIdeasLoading(true);
    setBlogIdeasLoaded(false);
    setBlogIdeaList([]);
    var query = blogTopicInput ? blogTopicInput : null;
    if (!query) {
      errors.push("Invalid blog topic")
      await seterrorList(errors)
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
          },
          signal,
        })
          .then(data => {
            return data.json()
          }
          )
        console.log("data:", data);
        setBlogIdeaList([...data.blog_ideas])
      } catch (error) {
        setBlogIdeasLoading(false);
        console.error(error);
        errorList.push(error as string)
      }
    }
    generate().then(() => {
      setBlogIdeasLoading(false);
      setBlogIdeasLoaded(true);
      setBlogTopicInput('');
    })

  }
  const writeblog = async (idea: string) => {
    setBlogDoneWriting(false);
    setBlogPostText("")
    let controller = (new AbortController())
    setController(controller)
    var signal = controller.signal
    const generate = async () => {
      try {
        var url = `/api/streamblog/${idea}/`
        const res = await fetch(url, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal,
        })
        console.log("blog stream recieved", res)
        const reader = res.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let preDisplayText = ""
        let toDisplayText = ""
        let trimmedBeginning = false
        console.time("timeout 3s start")
        setTimeout(() => {
          console.timeEnd("timeout 3s end")
        }, 3000);
        console.time("while loop start")
        let looperrorcount = 0
        while (true && looperrorcount < 3) {
          try {
            const chunk = await reader?.read();
            const { done, value } = chunk!;
            let decodedChunk = decoder.decode(value);

            //trim beginning of text  
            if (!trimmedBeginning) {
              //send all data to 1st pre-display variable
              preDisplayText += decodedChunk;
              //check if the characters that come before the actual response have been rendered
              if (preDisplayText.includes(': \\"') ||
                (preDisplayText.includes(':\\"'))) {
                //when found, switch bugget and add the split pre-display to respective buckets
                trimmedBeginning = true
                let splitstring: string[] = [];
                if (preDisplayText.includes(': \\"'))
                  splitstring = preDisplayText.split(': \\"')
                else if (preDisplayText.includes(':\\"'))
                  splitstring = preDisplayText.split(':\\"')
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
            looperrorcount++;
            console.error(error);
          }
        }
        if (looperrorcount > 2) { console.log("failed") }
      } catch (error) {
        if (signal.aborted) {
          setBlogPostText("Error Occured while generating")
          setBlogDoneWriting(true);
        }
        console.error(error);
      } finally {
        setController(null)
      }
    }
    generate().then(
      () => {
        setBlogDoneWriting(true);
      }
    )
  }

  return (
    <main className={`text-black flex min-h-screen flex-col  content-center px-10 `}>

      <div className="flex flex-col gap-y-2 w-[100%] ">
        <h1 className="text-xl text-center text-primary-400
        md:text-6xl sm:text-4xl my-4">AI Blog Generator</h1>

        <button className="transform  rounded-md bg-primary-600/95 px-5 py-2 my-2 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 w-100%  "
          onClick={
            () => setMainSectionHidden(!mainSectionHidden)
          }>Hide Left Section</button>
        <div className="flex flex-col lg:flex-row gap-4 justify-around p-4 border-2 border-black w-full bg-gray-50 ">
          <div className={"flex flex-col  gap-y-2 w-[100%] " + (mainSectionHidden ? "hidden" : "")}>

            <p className="inline-block relative font-semibold text-center ">Enter Blog Topic to Generate Blog Article Ideas</p>
            {/* PART 1 */}
            <form action={getblogideas} className="relative flex flex-col">
              <input className="border-2 border-gray-400 bg-white p-2 my-2 rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
              {errorList.map((err, index) => {
                return <p key={index} className="text-primary-500-400 text-md text-center bg-red-50 border-2 px-3 py-1 rounded-sm">
                  {err}
                </p>
              })}
              {(blogIdeasLoading && !blogIdeasLoaded && errorList.length == 0) ?
                <div className="flex flex-col text-cente ">
                  <div className="flex flex-row">
                    <p className="w-full">blog ideas generating... </p>
                    <button
                      type="submit"
                      onSubmit={(e) => { controller?.abort(); setController(null); console.log("aborted"); }}
                      className="transform w-full rounded-md bg-red-600/95 px-5 py-2 my-2 font-medium text-primaryText-light transition-colors hover:bg-red-500/90  duration-300 w-100%  "
                    >Abort</button>
                  </div>
                  <BeatLoader color="black" className=" w-20" loading={blogIdeasLoading} />
                </div>
                :
                <button
                  type="submit"
                  onSubmit={(e) => { e.preventDefault(); getblogideas(); }}
                  className="transform  rounded-md bg-primary-600/95 px-5 py-2 my-2 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 w-100%  "
                >Generate Article Ideas</button>
              }

            </form>
            {/* PART 2 */}
            <form action={() => writeblog(selectedBlogIdea ? selectedBlogIdea : "drone")} className=" flex w-[100%] flex-col gap-2 ">
              <p className="inline-block font-semibold">Select a blog topic then generate the article using AI</p>
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
                disabled={blogIdeasLoading && !blogIdeasLoaded && (blogIdeaList.length == 0) || (blogIdeasLoaded && !blogDoneWriting) || selectedBlogIdea == null}
                className="transform rounded-md bg-primary-600/95 px-5 py-2 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 disabled:bg-slate-300">
                {!blogDoneWriting ? "generating..." : "Write Article"}
                <BeatLoader color="black" className="" loading={!blogDoneWriting} />
              </button>
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

              {showPreview ? <Markdown className={"text-center prose w-[100%]  border-2 min-h-48 border-gray-400 rounded-b-xl overflow-scroll bg-gray-100 max-h-full resize-y  text-black "}>
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
              <button type="button" disabled={!blogDoneWriting || blogPostText == ""} className="disabled:bg-slate-300  transform rounded-md bg-primary-600/95 px-5 py-3 font-medium text-primaryText-light transition-colors hover:bg-primary-500/90  duration-300 " onClick={() => { blogPostText ? navigator.clipboard.writeText(blogPostText) : console.log("nothing to copy"); }}
              >Copy Text</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
