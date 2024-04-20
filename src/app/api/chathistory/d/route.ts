import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'


export async function DELETE(request: Request) {
  const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
  const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
  const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

  try {
    const { id } = await request.json();

    const response = await fetch(`${elasticsearchUrl}/chat-history/_doc/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${elasticsearchUsername}:${elasticsearchPassword}`)}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Elasticsearch request failed with status ${response.status}: ${errorText}`);
    }
    console.log('Chat history entry deleted successfully:', id);
    return NextResponse.json({ message: 'Chat history entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history entry:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the chat history entry.' }, { status: 500 });
  }
}