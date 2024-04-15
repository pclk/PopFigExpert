import { ReplicateStream, StreamingTextResponse } from 'ai';
import Replicate from 'replicate';
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || '',
});

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log('Received messages:', messages);



  const response = await replicate.predictions.create({
    stream: true,
    version: "cf18decbf51c27fed6bbdc3492312c1c903222a56e3fe9ca02d6cbe5198afc10",
    input: {
      prompt: messages.messages,
    },
  });

  console.log('Replicate API response:', response);

  const stream = await ReplicateStream(response);

  return new StreamingTextResponse(stream);
}