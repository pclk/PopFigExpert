import MistralClient from "@mistralai/mistralai";
import { MistralStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const model = "mistral-small-2312";
  let response = await client.chatStream({
    model: model,
    messages: messages,
    // tools: tools,
  });

  // Convert the response into a friendly text-stream. The Mistral client responses are
  // compatible with the Vercel AI SDK MistralStream adapter.
  const stream = MistralStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
