
import Markdown from 'react-markdown'
const page = () => {
  const markdownn = `# Step-by-Step Guide
## Sign In
  The app begins by checking if you are signed in. If you are already signed in, it proceeds to the dashboard; otherwise, it displays a message indicating that you are not signed in.    
## Dashboard
  If signed in, you'll be directed to the dashboard. The dashboard serves as the main interface for generating blog content.
## Generate Article Ideas
  In the left section, there's an input field where you can enter a blog topic to generate article ideas.
  Fill in the desired blog topic and click on the "Generate Article Ideas" button. 
## Select a Blog Idea
  Once the ideas are generated, a list of potential blog ideas will be displayed.
  Choose a blog idea from the list by selecting the corresponding radio button.
## Write Article
  In the right section, you'll find a textarea where the generated article content will be displayed.
  Click on the "Write Article" button to start the AI-powered content generation process.
## Preview and Edit
  Toggle between "Preview" and "Edit" modes using the buttons at the top of the textarea.
  In "Preview" mode, you can view the generated article in a formatted manner using Markdown.
  In "Edit" mode, you can modify the content directly in the textarea. `
  return (
    <main className=' w-screen  bg-accent h-fit'>
      <div  >
        {/* <Markdown className={" absolute  prose prose-xl text-center py-12 mx-[20%] leading-7 " + font.className}>
          {markdownn}
        </Markdown> */}

        <Markdown className={`   
        text-accent-content
        prose-headings:text-neutral
        prose-h1:underline-offset-[8px]
        prose-h1:underline
        select-none 
        prose-headings:translate-y-[2px]
        prose-headings:translate-x-[2px]  
        prose
        prose-lg
        text-center
        py-12
        md:mx-[20%]
        mx-[5%]
        leading-7` }>
          {markdownn}
        </Markdown>
      </div >
    </main>
  )
}

export default page