"use server";

import { Message } from "ai";

const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

type GroupedDocument ={
  title: string;
  highlight_title: string;
  date: string;
  country: string;
  url: string;
  multiple_chunks: string[];
  multiple_highlight_chunks: string[];
}

type SearchResult = {
  title: string;
  url: string;
  date: string;
  country: string;
  content: string;
  highlight?: {
    title?: string;
    content?: string;
  }
}

export async function searchDocuments(
  content?: string,
  title?: string,
  startDate?: string,
  endDate?: string,
  country?: string,
  top_k?: number,
) {
  try {
    const requestBody = {
      from: 0,
      size: 10,
      query: {
        bool: {
          must: [] as { match: { [key: string]: string } }[],
          filter: [] as {
            range?: { [key: string]: { gte?: string; lte?: string } };
          }[],
        },
      },
      highlight: {
        require_field_match: false,
        pre_tags: ["<mark class='bg-darkprim text-white'>"],
        post_tags: ["</mark>"],
        fields: {},
      },
    };

    if (country) {
      requestBody.query.bool.must.push({ match: { country: country } });
    }

    if (top_k !== undefined) {
      requestBody.size = top_k; // Add the size parameter only if top_k is provided
    }

    if (startDate && endDate) {
      requestBody.query.bool.filter.push({
        range: { date: { gte: startDate, lte: endDate } },
      });
    } else if (startDate) {
      requestBody.query.bool.filter.push({
        range: { date: { gte: startDate } },
      });
    } else if (endDate) {
      requestBody.query.bool.filter.push({
        range: { date: { lte: endDate } },
      });
    }

    if (content) {
      requestBody.query.bool.must.push({ match: { content: content } });
      requestBody.highlight.fields = {
        ...requestBody.highlight.fields,
        content: {
          highlight_query: { match: { content: content } },
          number_of_fragments: 0,
        },
      };
    }

    if (title) {
      requestBody.query.bool.must.push({ match: { title: title } });
      requestBody.highlight.fields = {
        ...requestBody.highlight.fields,
        title: {
          highlight_query: { match: { title: title } },
          number_of_fragments: 0,
        },
      };
    }
    // console.log("sending request body", requestBody);

    const response = await fetch(`${process.env.HOST_URL}/api/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    let parsedData;
    try {
      parsedData = await response.json();
    } catch (jsonParseError) {
      console.error("Failed to parse JSON response:", jsonParseError);
      throw new Error(
        "Failed to parse the response from the server. The server might be experiencing issues or the response format may have changed.",
      );
    }

    console.log("Elastic Response Status:", response.status);
    console.log("Elastic body", parsedData)

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Search request failed with status ${response.status}: ${errorText}`,
      );
    }
    const groupedDocuments: GroupedDocument[] = [];
    const urlMap: { [url: string]: GroupedDocument} = {};
    console.log('parsedData length', parsedData.hits.hits.length)

    // Format the parsed data as seen in document.tsx
    parsedData.hits.hits.forEach((hit: any) => {
      const {
        title,
        url,
        date,
        country,
        content
      }: SearchResult = hit._source;
      const {
        title: highlight_title,
        content: highlight_content
      } = hit.highlight ?? {}
      if (url in urlMap) {
        urlMap[url].multiple_chunks.push(content);
        urlMap[url].multiple_highlight_chunks.push(highlight_content);
      } else {
        urlMap[url] = {
          title: title,
          highlight_title: highlight_title,
          date: date,
          url: url,
          country: country,
          multiple_chunks: [content],
          multiple_highlight_chunks: [highlight_content]
        }
      }
    });

    Object.values(urlMap).forEach((doc) => {
      groupedDocuments.push(doc);
    });
    // console.log('groupedDocuments in elastic_action', groupedDocuments)

    // Return the formatted data if the response was successful
    return groupedDocuments;
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
