// app/actions.ts
'use server'

import client from '@/lib/elasticsearch'

// Search documents with filter parameters
export async function searchDocuments(query: string, filters: any) {
  try {
    const { date, country, title } = filters

    const must = [
      {
        multi_match: {
          query: query,
          fields: ['title', 'content'],
        },
      },
    ]

    if (date) {
      must.push({
        multi_match: { query: date, fields: ['date'] },
      })
    }

    if (country) {
      must.push({
        multi_match: { query: country, fields: ['country'] },
      })
    }

    if (title) {
      must.push({
        multi_match: { query: title, fields: ['title'] },
      })
    }

    const response = await client.search({
      index: 'mfa-press',
      query: {
        bool: {
          must: must,
        },
      },
      highlight: {
        fields: {
          content: {},
        },
      },
    })

    return response.hits.hits.map((hit: any) => hit._source)
  } catch (error) {
    console.error('Error searching documents:', String(error).slice(0, 50))
    throw new Error('An error occurred while searching documents. Please try again later.')
  }
}


// CRUD operations for chat history data
export async function createChatHistory(history: any) {
  try {
    await client.index({
      index: 'chathist',
      body: history,
    })
  } catch (error) {
    console.error('Error creating chat history:', String(error).slice(0, 50))
    throw new Error('An error occurred while creating chat history. Please try again later.')
  }
}

export async function getChatHistory(id: string) {
  try {
    const response = await client.get({
      index: 'chathist',
      id: id,
    })
    return response._source
  } catch (error) {
    console.error('Error retrieving chat history:', String(error).slice(0, 50))
    throw new Error('An error occurred while retrieving chat history. Please try again later.')
  }
}

export async function updateChatHistory(id: string, history: any) {
  try {
    await client.update({
      index: 'chathist',
      id: id,
      body: {
        doc: history,
      },
    })
  } catch (error) {
    console.error('Error updating chat history:', String(error).slice(0, 50))
    throw new Error('An error occurred while updating chat history. Please try again later.')
  }
}

export async function deleteChatHistory(id: string) {
  try {
    await client.delete({
      index: 'chathist',
      id: id,
    })
  } catch (error) {
    console.error('Error deleting chat history:', String(error).slice(0, 50))
    throw new Error('An error occurred while deleting chat history. Please try again later.')
  }
}