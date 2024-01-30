
export default async function calculateTokensUsed(stream: ReadableStream) { //for internal usage. user token prices is static
  const decoder = new TextDecoder("utf-8");
  const reader = stream.getReader()
  let looperrorcount = 0
  let tokens_used = 0
  let fulltext = ""
  while (true && looperrorcount < 3) {
    try {
      const chunk = await reader?.read();
      const { done, value } = chunk!;
      // calculate tokens used
      const decodedvalue = decoder.decode(value)
      tokens_used += decodedvalue?.length ? decodedvalue.length / 4 : 0
      if (done) break;
    } catch (error) {
      looperrorcount++;
      console.error(error);
      break;
    }
  }
  console.log("openai_response_tokens:", tokens_used)
  return tokens_used;
}