import { ReplicateStream, StreamingTextResponse } from 'ai';
import Replicate from 'replicate';

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log('Received messages:', messages);

  

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });
  
  try {
    const response = await replicate.predictions.create({
      model: "mistralai/mixtral-8x7b-instruct-v0.1",
      stream: true,
      input: {
        prompt: messages.messages,
      },
    });
    console.log('Replicate API response:', response);

    
    const stream = await ReplicateStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in /api/replicate route handler:');
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    }
    
    return new Response(
      JSON.stringify({ error: error.message, messages: messages }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}