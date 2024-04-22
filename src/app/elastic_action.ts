"use server";


const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;


export async function searchDocuments(query: string, filters: any) {
    try {
      const { date, country, title } = filters;
      const must = [
        {
          multi_match: {
            query: query,
            fields: ["title", "content"],
          },
        },
      ];
  
      if (date) {
        must.push({
          multi_match: {
            query: date,
            fields: ["date"],
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
  
      const response = await fetch(`${process.env.HOST_URL}/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });
  
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
  
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