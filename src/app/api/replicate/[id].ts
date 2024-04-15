import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (response.status !== 200) {
    const error = await response.json();
    return new NextResponse(JSON.stringify({ detail: error.detail }), {
      status: 500,
    });
  }

  const prediction = await response.json();
  return new NextResponse(JSON.stringify(prediction), { status: 200 });
}
