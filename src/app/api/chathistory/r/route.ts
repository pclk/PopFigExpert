import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { elasticsearchUrl, elasticsearchUsername, elasticsearchPassword } =
      await request.json();

    console.log("Fetching chat history from Elasticsearch");
    const response = await fetch(`${elasticsearchUrl}/chat-history/_search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${elasticsearchUsername}:${elasticsearchPassword}`)}`,
        "cache-control": "no-store",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Elasticsearch request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const chatHistory = data.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));

    return NextResponse.json(chatHistory, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the chat history." },
      { status: 500 },
    );
  }
}
