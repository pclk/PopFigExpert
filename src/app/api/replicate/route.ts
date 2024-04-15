import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Pinned to a specific version of Stable Diffusion
      // See https://replicate.com/stability-ai/sdxl
      version:
        "2b017d9b67edd2ee1401238df49d75da53c523f36e363881e057f5dc3ed3c5b2",
      // This is the text prompt that will be submitted by a form on the frontend
      input: { prompt },
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    return new Response(JSON.stringify({ detail: error.detail }), {
      status: 500,
    });
  }

  const prediction = await response.json();
  return new Response(JSON.stringify(prediction), { status: 201 });
}
