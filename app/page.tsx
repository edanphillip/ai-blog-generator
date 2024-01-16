//app/page.tsx
'use client'

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
  const [blogTopicInput, setBlogTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogIdeaList, setBlogIdeaList] = useState<blogidea[]>([])
  const [selectedBlogIdea, setSelectedBlogIdea] = useState("drone")
  const [blogPost, setPart2Response] = useState<blogpost>({ response: "" })
  const getblogideas = async () => {
    setIsLoading(true);

    try {
      var url = `/api/gpt/${blogTopicInput}/`
      const { data } = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
      console.log("data:", data);
      setBlogIdeaList([...data.blog_ideas])
    } catch (error) {
      console.error(error);
    }


    setIsLoading(false);
    setBlogTopicInput('');
  }
  const writeblog = async (idea: string) => {
    setIsLoading(true);
    try {
      var url = `/api/writeblog/${idea}/`
      const { data } = await fetch(url, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(data => data.json())
      console.log("part2response:",);
      setPart2Response(data)
    } catch (error) {
      console.error(error);
    }


    setIsLoading(false);
  }
  return (
    <main className={`flex min-h-screen flex-col  content-center w-9/12`}>
      <div className="flex flex-col gap-y-5 w-[100%]">
        {/* PART 1 */}
        <p className="inline-block relative  ">Enter Blog Topic to Generate Blog Article Ideas</p>
        <form action={getblogideas} className="relative ">
          <input className="bg-gray-600 p-2 rounded-lg  w-[100%] " type="text" value={blogTopicInput} onChange={(e) => setBlogTopicInput(e.target.value)} />
          <button type="submit" className="inline-block align-top h-[100%] m-auto relative w-[20%] min-w-[50px]">Submit</button>
        </form>
        <div className="flex flex-col gap-4 justify-around p-4 border-2 border-white">
          <h2 className="text-xl font-bold">Options:</h2>
          {/* <p className="flex " dangerouslySetInnerHTML={{ __html: response }}></p> */}


          {/* PART 2 */}
          <BeatLoader color="gray" loading={isLoading} />
          <form action={() => writeblog(selectedBlogIdea)} className="relative flex flex-col gap-2 w-[100%]">
            {blogIdeaList &&
              blogIdeaList.map((item, index) => {
                return (
                  <label key={index} className="" >
                    <input type="radio" name="blogidea" id="radio" onChange={e => setSelectedBlogIdea(e.target.value)} value={item.idea} />
                    {item.idea}
                  </label>
                )
              })
            }
            <button type="submit" className="inline-block align-top h-[100%] m-auto relative w-[20%] min-w-[50px]">Submit</button>
          </form>
          {/* PART 3*/}
          <Markdown className={"bg-slate-500"}>{blogPost?.response}</Markdown>
          {/* <textarea value={blogPost?.response} className="resize-y text-black min-h-[800px]" onChange={(e) => setPart2Response({ response: e.target.value })}>
          </textarea> */}
          <button type="button" className="hover:bg-blue-700 transition-colors p-2" onClick={() => { navigator.clipboard.writeText(blogPost.response) }}
          >Copy Text</button>
        </div>
      </div>
    </main>
  )
}
