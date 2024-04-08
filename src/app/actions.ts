// app/actions.ts
'use server'

import client from '@/lib/elasticsearch'

export async function searchDocuments(query: string) {
  try {
    const response = await client.search({
      index: 'mfa-press',
      query: {
        multi_match: {
          query: query,
          fields: ['title', 'content'],
        },
      },
      highlight: {
        fields: {
          content: {},
        },
      }
    })
    // console.log('Response:', response.hits.hits.map((hit: any) => hit._source));

    return response.hits.hits.map((hit: any) => hit._source)
  } catch (error) {
    console.log(process.cwd());
    console.error('Error searching documents:', String(error).slice(0, 50));
    throw new Error('An error occurred while searching documents. Please try again later.');
  }
}

// another server action for saving chathistory