import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'


export async function POST(request: Request) {
  const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
  const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
  const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

  try {
    const { user, message, timestamp } = await request.json();

    const chatHistoryDocument = {
      user,
      message,
      timestamp,
    };

    const response = await fetch(`${elasticsearchUrl}/chat-history/_doc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${elasticsearchUsername}:${elasticsearchPassword}`)}`,
      },
      body: JSON.stringify(chatHistoryDocument),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Elasticsearch request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const id = data._id; // Retrieve the automatically generated ID

    console.log('Chat history inserted successfully:', { id, ...chatHistoryDocument });

    return NextResponse.json({ message: 'Chat history inserted successfully', id });
  } catch (error) {
    console.error('Error inserting chat history:', error);
    return NextResponse.json({ error: 'An error occurred while inserting chat history.' }, { status: 500 });
  }
}