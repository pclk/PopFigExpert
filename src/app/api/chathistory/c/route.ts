import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const {
      chatID,
      messages,
      aiState,
      elasticsearchUrl,
      elasticsearchUsername,
      elasticsearchPassword,
    } = await request.json();

    const chatHistoryDocument = {
      messages,
      aiState,
    };

    const response = await fetch(
      `${elasticsearchUrl}/chat-history/_doc/${chatID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${elasticsearchUsername}:${elasticsearchPassword}`)}`,
        },
        body: JSON.stringify(chatHistoryDocument),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Elasticsearch request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    console.log("Chat history inserted successfully:", {
      id: data._id,
      ...chatHistoryDocument,
    });

    return NextResponse.json({ id: data._id });
  } catch (error) {
    console.error("Error inserting chat history:", error);
    return NextResponse.json(
      { error: "An error occurred while inserting chat history." },
      { status: 500 },
    );
  }
}
