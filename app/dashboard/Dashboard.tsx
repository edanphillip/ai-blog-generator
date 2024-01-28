'use client';
import getTokenShopPrice from "../lib/getprices";
import { ModelSelectDropdown } from "./DropdownMenuRadioGroupSelectModel";
import useAutosizeTextArea from "../components/useAutosizeTextArea";
import { useState, useRef } from "react";
import coin from "/public/coin.png";
import Markdown from "react-markdown";
import { BeatLoader } from "react-spinners";
import React from 'react';
import { acceptedStreamModels } from "../types";
import Image from "next/image";
import { blogidea } from "./page";

export function Dashboard() {
  const [blogIdeasLoading, setBlogIdeasLoading] = useState(false);
  const [blogIdeasLoaded, setBlogIdeasLoaded] = useState(false);
  const [blogDoneWriting, setBlogDoneWriting] = useState(true);
  const [mainSectionHidden, setMainSectionHidden] = useState(false);
  const [blogTopicInput, setBlogTopicInput] = useState('');
  const [blogIdeaList, setBlogIdeaList] = useState<blogidea[]>([]);
  const [selectedBlogIdea, setSelectedBlogIdea] = useState('');
  const [blogPostText, setBlogPostText] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [controller1, setController1] = useState<AbortController | null>(null);
  const [controller2, setController2] = useState<AbortController | null>(null);
  const [selectedModel, setSelectedModel] = useState<acceptedStreamModels>("gpt-3.5-turbo-16k-0613");
  const [selectedModel2, setSelectedModel2] = useState<acceptedStreamModels>("gpt-3.5-turbo-16k-0613");
  // const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // useAutosizeTextArea(textAreaRef.current, blogPostText);
  const [errorList, seterrorList] = useState<string[]>([]);
  async function getblogideas() {
    if (controller1?.signal.aborted !== true) {
      controller1?.abort();
    }
    let controller = (new AbortController());
    setController1(controller);
    let errors: string[] = [];
    seterrorList(errors);
    var signal = controller.signal;

    setBlogIdeasLoading(true);
    setBlogIdeasLoaded(false);
    setBlogIdeaList([]);
    var query = blogTopicInput ? blogTopicInput : null;
    if (!query) {
      errors.push("Invalid blog topic");
      seterrorList(errors);
      return;
    };
    const generate = async () => {
      try {
        var url = `/api/gpt/${selectedModel}/${query}`;
        const { data } = await fetch(url, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal,
        })
          .then(data => {
            return data.json();
          }
          );
        console.log("data:", data);
        setBlogIdeaList([...data.blog_ideas]);
      } catch (error) {
        setBlogIdeasLoading(false);
        console.error(error);
        errorList.push(error as string);
      }
    };
    generate().then(() => {
      setBlogIdeasLoading(false);
      setBlogIdeasLoaded(true);
      setBlogTopicInput('');
    });

  };

  async function writeblog(idea: string) {
    if (controller2?.signal.aborted !== true) {
      controller2?.abort();
    }
    setBlogDoneWriting(false);
    setBlogPostText("");
    let controller = (new AbortController());
    setController2(controller);
    var signal = controller.signal;
    const generate = async () => {
      try {
        var url = `/api/streamblog/${selectedModel}/${idea}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          signal,
        });
        console.log("blog stream recieved", res);
        const reader = res.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let preDisplayText = "";
        let toDisplayText = "";
        let trimmedBeginning = false;
        let looperrorcount = 0;
        let tokens_used = 0;
        while (true && looperrorcount < 3) {
          try {
            const chunk = await reader?.read();
            const { done, value } = chunk!;
            let decodedChunk = decoder.decode(value);
            //calculate tokens used  
            // tokens_used += value?.length ? value.length / 4 : 0
            //trim beginning of text  
            if (!trimmedBeginning) {
              //send all data to 1st pre-display variable
              preDisplayText += decodedChunk;
              //check if the characters that come before the actual response have been rendered
              if (preDisplayText.includes(': \\"') ||
                (preDisplayText.includes(':\\"'))) {
                //when found, switch bugget and add the split pre-display to respective buckets
                trimmedBeginning = true;
                let splitstring: string[] = [];
                if (preDisplayText.includes(': \\"'))
                  splitstring = preDisplayText.split(': \\"');
                else if (preDisplayText.includes(':\\"'))
                  splitstring = preDisplayText.split(':\\"');
                preDisplayText = splitstring[0];
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
              setBlogPostText(toDisplayText);
              break;
            }
            // setTokensUsed(tokens_used);
            setBlogPostText(toDisplayText);
          } catch (error) {
            looperrorcount++;
            console.error(error);
          }
        }
        console.log("tokens used: ", tokens_used);
        if (looperrorcount > 2) { console.log("failed"); }
      } catch (error) {
        if (signal.aborted) {
          setBlogPostText("Error Occured while generating");
          setBlogDoneWriting(true);
        }
        console.error(error);
      } finally {
        setController2(null);
      }
    };
    generate().then(
      () => {
        setBlogDoneWriting(true);
      }
    );
  };



  return (
    <main className={`flex  flex-col max-w-screen overflow-x-clip text-neutral bg-neutral min-h-screen content-center px-10 `}>
      <div className="flex flex-col text-blue gap-y-2 w-[100%] ">
        <div className="bg-accent text-accent-content flex flex-col lg:flex-row gap-4 justify-around p-4 border-2 border-black w-full  ">
          <div className={"flex flex-col  gap-y-2 w-[100%] justify-stretch " + (mainSectionHidden ? "hidden" : "")}>

            {/* PART 1 */}
            <form action={getblogideas} className="relative flex flex-col gap-1">
              <h2 className="inline-block relative font-semibold text-center text-xl">Generate Blog Article Ideas</h2>
              <div className="flex flex-col "><ModelSelectDropdown selectedModel={selectedModel} setSelectedModel={setSelectedModel} /></div>
              <input className="border-2 input input-accent text-accent   border-gray-400 p-2   rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
              {errorList.map((err, index) => {
                return <p key={index} className=" mb-2 text-center text-error-content  bg-error alert alert-error border-2 px-3 py-1 rounded-sm">
                  {err}
                </p>;
              })}
              {(blogIdeasLoading && !blogIdeasLoaded && errorList.length == 0) ?
                <div className="flex flex-col text-cente animate-[pulse]">
                  <div className="flex flex-row">
                    <button
                      onClick={(e) => { controller1?.abort(); setController1(null); console.log("aborted"); }}
                      className=" transform w-full animate-[pulse,1s,loop] rounded-md bg-red-600/95 px-5 py-2 my-2 font-medium text-primaryText-light transition-colors hover:bg-red-500/90  duration-300 w-100%  "
                    >Cancel</button>
                    <p className="w-full flex justify-center  align-middle items-center">generating<span className="pl-5 animate-bounce">. . .</span>  </p>
                  </div>
                </div>
                :
                <button
                  type="submit"
                  onSubmit={(e) => { e.preventDefault(); getblogideas(); }}
                  className="btn md:bottom-0  w-full  flex flex-row gap-4 justify-center transform rounded-md  px-5 py-2 font-medium transition-colors    duration-300  disabled:btn-disabled "
                >Generate Article Ideas {getTokenShopPrice({ model: selectedModel, service: "blogpostideas" })}
                  <div hidden={blogDoneWriting} className="flex flex-row justify-end align-middle items-center gap-1">
                    <Image src={coin.src} alt="coin" height={22} width={22} />
                  </div>
                </button>
              }
            </form>

            {blogIdeaList.length > 0 &&
              <div className="flex flex-col gap-2">
                <h2 className="text-xl  font-semibold text-center">Select a Blog Topic</h2>
                <div className="flex flex-col gap-1">
                  {blogIdeaList.map((item, index) => {
                    return (<div key={index}>
                      <label className="flex flex-row gap-2">
                        <input type="radio" name="blogidea" id="radio" onChange={e => setSelectedBlogIdea(e.target.value)} value={item.idea} />
                        {item.idea}
                      </label>
                    </div>
                    );
                  })}
                </div>
              </div>
            }

            {/* PART 2 */}

          </div>

          {/* Second Column */}
          <div className="flex flex-col gap-4 md:flex-row  w-[100%]">
            {/* PART 3*/}

            <div className="w-[100%] h-[680px]  text-center flex flex-col gap-2">
              {(!blogIdeasLoading && blogIdeasLoaded && blogIdeaList.length != 0 ||
                blogIdeasLoaded && blogDoneWriting && selectedBlogIdea !== '') &&
                <div className="[&>*:not(:first-child)]:border-top-2 border-primary-content  pt-2  ">
                  <form action={() => writeblog(selectedBlogIdea)} className="">
                    <div className="flex flex-col w-full">
                      <ModelSelectDropdown selectedModel={selectedModel2} setSelectedModel={setSelectedModel2} />
                      <input className="border-2 text-black border-gray-400 bg-slate-100 p-2 my-2 rounded-lg  w-[100%] "
                        type="text"
                        value={selectedBlogIdea}
                        onChange={(e) => setSelectedBlogIdea(e.target.value)} />
                      <button type="submit"
                        className="btn md:bottom-0  w-full  flex flex-row gap-4 justify-center transform rounded-md  px-5 py-2 font-medium transition-colors    duration-300  disabled:btn-disabled">
                        {!blogDoneWriting ? "generating..." : "Write Article"}
                        <div hidden={blogDoneWriting} className="flex flex-row justify-end align-middle items-center gap-1">
                          {getTokenShopPrice({ model: selectedModel, service: "article" })}<Image src={coin.src} alt="coin" height={22} width={22} />
                        </div>
                        <BeatLoader size={12} color="white" className="" loading={!blogDoneWriting} />
                      </button>
                    </div>
                  </form>
                </div>
              }
              {showPreview ? <Markdown className={"p-24  text-neutral bg-neutral text-center prose prose-md  prose-headings:text-black  w-[100%]  border-2 min-h-48 border-gray-400 rounded-b-lg overflow-scroll  bg-white/20 max-h-full resize-y  pros-bb   "}>
                {blogPostText}
              </Markdown> :
                <textarea id="textarea"
                  className="p-2 border-2 min-h-48 h-[100%] border-gray-400 rounded-b-xl  w-[100%]   text-primary"
                  // ref={textAreaRef}
                  onInput={(e) => {
                    e.currentTarget.style.height = ""; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                  }} value={blogPostText}
                  onChange={(e) => {
                    e.currentTarget.style.height = ""; e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                    setBlogPostText(e.target.value);
                  }}
                >
                </textarea>}
              {(!blogDoneWriting) &&
                <div className="flex flex-col text-cente animate-[pulse]">
                  <div className="flex flex-row">
                    <button
                      onClick={(e) => {
                        controller2?.abort();
                        setController2(null);
                        console.log("aborted");
                      }}
                      className="btn btn-primary transform w-full animate-[pulse] duration-1000 rounded-md bg-red-600/95 px-5 py-2 my-2 font-medium text-primaryText-light transition-colors hover:bg-red-500/90  w-100%  "
                    >Stop</button>
                  </div>
                </div>}
              {blogDoneWriting && blogPostText != "" && <button type="button" className="btn border-2 border-neutral rounded-md btn-secondary transition-colors inline-block bg-transparent text-xl w-full  justify-center" onClick={() => { blogPostText ? navigator.clipboard.writeText(blogPostText) : console.log("nothing to copy"); }}
              >Copy Text</button>}

              <div className="togglePreview flex flex-row w-[100%] min-h-10">
                {!showPreview && <button
                  className={"btn transform  rounded-md  px-5 py-2 font-medium  transition-colors   duration-300 w-full"}
                  onClick={() => setShowPreview(true)}>
                  Preview
                </button>}
                {showPreview &&
                  <button
                    className={"btn transform  rounded-md  px-5 py-2 font-medium  transition-colors   duration-300 w-full"}
                    onClick={() => setShowPreview(false)}>
                    Edit
                  </button>}
              </div>
            </div>
          </div>
        </div>
        <button className="btn transform  rounded-md  px-5 py-2 my-2 font-medium  transition-colors   duration-300 w-100%  "
          onClick={() => setMainSectionHidden(!mainSectionHidden)}>Toggle Left Section</button>
      </div>
    </main>
  );
}
