
import React from 'react'
import NavBar from './components/NavBar'
import Markdown from 'react-markdown'
import { BioRhyme as Font } from 'next/font/google'
const font = Font({ weight: '400', subsets: ['latin'] });
const page = () => {
  const markdownn = `# Step-by-Step Guide for Users:
## Sign In:
  The app begins by checking if you are signed in. If you are already signed in, it proceeds to the dashboard; otherwise, it displays a message indicating that you are not signed in.    
## Dashboard:
  If signed in, you'll be directed to the dashboard. The dashboard serves as the main interface for generating blog content.
## Generate Article Ideas:
  In the left section, there's an input field where you can enter a blog topic to generate article ideas.
  Fill in the desired blog topic and click on the "Generate Article Ideas" button.
## Abort Generation (Optional):
  While the ideas are being generated, you have the option to abort the process by clicking the "Abort" button.
## Select a Blog Idea:
  Once the ideas are generated, a list of potential blog ideas will be displayed.
  Choose a blog idea from the list by selecting the corresponding radio button.
## Write Article:
  In the right section, you'll find a textarea where the generated article content will be displayed.
  Click on the "Write Article" button to start the AI-powered content generation process.
## Preview and Edit:
  Toggle between "Preview" and "Edit" modes using the buttons at the top of the textarea.
  In "Preview" mode, you can view the generated article in a formatted manner using Markdown.
  In "Edit" mode, you can modify the content directly in the textarea.
## Copy Text (Optional):
  If satisfied with the generated content, you can click on the "Copy Text" button to copy the content to your clipboard.
## Logout (Optional):
   If you're signed in, you can log out using the logout functionality provided.`
  return (
    <div  >
      <NavBar />
      <div  >
        <Markdown className={" absolute  prose prose-xl text-center py-12 mx-[20%] leading-7 " + font.className}>
          {markdownn}
        </Markdown>
        <Markdown className={`  prose-headings:bg-gradient-to-r prose-headings:from-primary-500 prose-headings:via-primary-900 prose-headings:to-primary-500
        prose-headings:animate-shake
        prose-headings:bg-clip-text prose-headings:text-transparent   absolute select-none  prose-headings:translate-y-[2px] prose-headings:translate-x-[2px]   -z-10 p prose prose-xl text-center py-12 mx-[20%] leading-7 ` + font.className}>
          {markdownn}
        </Markdown>
      </div>
    </div >
  )
}

export default page