"use server";

import { Message } from "ai";

const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

export async function searchDocuments(
  content?: string,
  startDate?: string,
  endDate?: string,
  country?: string,
  title?: string,
  top_k?: number,
) {
  try {
    const must = []

    if (content) {
      must.push({
        multi_match: {
          query: content,
          fields: ["content"],
        },
      });
    }

    if (country) {
      must.push({
        multi_match: {
          query: country,
          fields: ["country"],
        },
      });
    }

    if (title) {
      must.push({
        multi_match: {
          query: title,
          fields: ["title"],
        },
      });
    }

    const requestBody: any = {
      query: {
        bool: {
          must: must,
        },
      },
    };

    if (top_k !== undefined) {
      requestBody.size = top_k; // Add the size parameter only if top_k is provided
    }

    if (startDate) {
      requestBody.query = 
      {bool: {
        must: [
          {
            range: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          ...must,
        ],
      },}}
        

    const response = await fetch(`${process.env.HOST_URL}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Elastic Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Search request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    return data.hits.hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error(
      "An error occurred while searching documents. Please try again later.",
    );
  }
}

export async function fetchChatHistory() {
  "use server";

  const response = await fetch(`${process.env.HOST_URL}/api/chathistory/r`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      elasticsearchUrl,
      elasticsearchUsername,
      elasticsearchPassword,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fetch chat history failed with status ${response.status}: ${errorText}`,
    );
  }
  const chatHistory = await response.json();
  return chatHistory;
}

export async function insertChatHistory(data: {
  chatID: string;
  messages: Message[];
  aiStateID: string;
}) {
  "use server";

  const response = await fetch(`${process.env.HOST_URL}/api/chathistory/c`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      elasticsearchUrl,
      elasticsearchUsername,
      elasticsearchPassword,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Insert chat history failed with status ${response.status}: ${errorText}`,
    );
  }

  const { id } = await response.json();
  return id;
}

async function deleteChatHistory(chatID: string) {
  "use server";

  const response = await fetch(`${process.env.HOST_URL}/api/chathistory/d`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatID,
      elasticsearchUrl,
      elasticsearchUsername,
      elasticsearchPassword,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Delete chat history failed with status ${response.status}: ${errorText}`,
    );
  }
}
