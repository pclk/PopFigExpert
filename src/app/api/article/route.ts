import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
  const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
  const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

  try {
    const requestBody = await request.json();
    console.log("requstbody:", requestBody);

    const response = await fetch(`${elasticsearchUrl}/article/_search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${elasticsearchUsername}:${elasticsearchPassword}`)}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Elasticsearch request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching documents:", error);
    return NextResponse.json(
      { error: "An error occurred while searching documents." },
      { status: 500 },
    );
  }
}
