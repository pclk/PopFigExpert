"use server";
import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableUI,
  render,
  getAIState,
} from "ai/rsc";
import OpenAI from "openai";

import { HistoryType } from "@/lib/validators/HistoryType";
import { nanoid } from "ai";
import { MessageType } from "../lib/validators/MessageType";
import { cookies } from "next/headers";
import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";

const elasticsearchUrl = process.env.ELASTICSEARCH_URL;
const elasticsearchUsername = process.env.ELASTICSEARCH_USERNAME;
const elasticsearchPassword = process.env.ELASTICSEARCH_PASSWORD;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

let modelType = "gpt-3.5-turbo";

async function changeModel(model: string) {
  "use server";
  console.log("triggered changemodel function");

  if (model === "gpt-3.5-turbo") {
    modelType = "gpt-3.5-turbo";
    console.log("triggered changemodel function: gpt-3.5-turbo");
  } else {
    modelType = "mistralai/mixtral-8x7b-instruct-v0.1";
    console.log("triggered changemodel function: mixtral 7x8b");
  }

  // Set the modelType value in a cookie
  cookies().set("modelType", modelType);
}

// Retrieve the modelType value from the cookie on each request
async function getModelType() {
  "use server";
  return cookies().get("modelType")?.value || "gpt-3.5-turbo";
}

async function submitUserMessage(userInput: string): Promise<Message> {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([...aiState.get(), { role: "user", content: userInput }]);

  const reply = createStreamableUI(
    <div>
      <p>Thinking...</p>
    </div>,
  );

  if (
    cookies().get("modelType")?.value === "mistralai/mixtral-8x7b-instruct-v0.1"
  ) {
    try {
      console.log("Texting mistral", JSON.stringify({ messages: [userInput] }));

      const response = await fetch("http://127.0.0.1:3000/api/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (response.ok) {
        const reader = response.body!.getReader();
        let text = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            reply.done();
            aiState.done([
              ...aiState.get(),
              { role: "assistant", content: text },
            ]);
            break;
          }

          const chunks = new TextDecoder("utf-8").decode(value).split('"');
          const chunk = chunks.filter((_, index) => index % 2 !== 0).join("");
          text += chunk;
          reply.update(<div>{text}</div>);
        }
      } else {
        console.error(
          "Error response from /api/mistral:",
          response.status,
          response.statusText,
        );
        try {
          const errorData = await response.json();
          console.error("Error details:", errorData);
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        reply.done();
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content: "An error occurred while processing your request.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error in submitUserMessage:", error);
      reply.done();
      aiState.done([
        ...aiState.get(),
        {
          role: "assistant",
          content: "An error occurred while processing your request.",
        },
      ]);
    }
  } else {
    const completion = runOpenAICompletion(openai, {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: `\
  You are an AI assistant within the Centre for Strategic Infocomm Technologies (CSIT) in the Ministry of Defence, operating on a secure intranet to deliver critical information to staff. Adhere to the following principles:
  1. **Professionalism**: Employ precise, clear, and objective language, avoiding colloquialisms and ensuring information accuracy.
  2. **Knowledgeability**: Utilize the ministry's document database to provide comprehensive insights on global political figures, historical contexts, and current events, ensuring relevance and depth in responses.

  When a user asks a question, search the Elasticsearch instance for relevant information and summarize the findings in a concise and intuitive manner. If the user requests a report summary, summarize up to 4 reports and display the results in an easy-to-understand format.

  If the user needs assistance with prompt engineering or has a specific level of proficiency, adjust your responses accordingly to guide them effectively.

  Additional functions:
  - \`search_news_articles\`: Search for relevant news articles based on the user's query.
  - \`generate_report_summary\`: Summarize up to 4 reports and display the results intuitively.
  `,
        },
        ...aiState.get().map((info: any) => ({
          role: info.role,
          content: info.content,
          name: info.name,
        })),
      ],
      functions: [
        {
          name: "search_news_articles",
          description:
            "Search for relevant news articles based on the user's query.",
          parameters: z.object({
            query: z
              .string()
              .describe("The search query provided by the user."),
          }),
        },
        {
          name: "generate_report_summary",
          description:
            "Summarize up to 4 reports and display the results intuitively.",
          parameters: z.object({
            reportIds: z
              .array(z.string())
              .describe("The IDs of the reports to summarize."),
          }),
        },
      ],
      temperature: 0,
    });

    completion.onTextContent((content: string, isFinal: boolean) => {
      reply.update(<div>{content}</div>);
      if (isFinal) {
        reply.done();
        aiState.done([...aiState.get(), { role: "assistant", content }]);
      }
    });

    completion.onFunctionCall("search_news_articles", async ({ query }) => {
      reply.update(
        <div>
          <div>searching..</div>
        </div>,
      );

      // const articles = await searchDocuments(query, {});

      reply.done(
        <div>
          <div>3articles</div>
        </div>,
      );

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "search_news_articles",
          content: JSON.stringify("user got articles"),
        },
      ]);
    });

    completion.onFunctionCall(
      "generate_report_summary",
      async ({ reportIds }) => {
        reply.update(
          <div>
            <div>Generating report summary...</div>
          </div>,
        );

        // const reports = await Promise.all(
        //   reportIds.map((id) => getChatHistory(id)),
        // );
        // const summary = generateReportSummary(reports);

        reply.done(<div>summary</div>);

        aiState.done([
          ...aiState.get(),
          {
            role: "function",
            name: "generate_report_summary",
            content: JSON.stringify("user got report summary"),
          },
        ]);
      },
    );
  }

  return {
    messageID: Date.now(),
    display: reply.value,
  };
}



export async function handleSendMessage(message: string): Promise<Message> {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  const currentMessages = aiState.get();

  // Add user message to the state
  aiState.update([...currentMessages, { role: "user", content: message }]);

  // Submit and get response message
  const responseMessage = await submitUserMessage(message);

  // Response message alr added in submitUserMessage

  return responseMessage;
}
export async function getAIStateAction(id: string): Promise<AIState[]> {
  "use server";
  return getAIState(id);
}
//Chat
const defaultValue = [
  {
    id: "ocH49A5lVYXi9izu6eNuU",
    label: "User seeking for order assistance.",
    messages: [
      {
        id: nanoid(),
        text: "Hello! How can I assist you today?",
        isUser: false,
      },
    ],
  },
];

const chatHistory = cookies().get("chatHistory");
const Chathistory: HistoryType[] = chatHistory
  ? JSON.parse(chatHistory.value)
  : [];

async function addHistory(history: HistoryType) {
  "use server";
  const updatedHistory = [...Chathistory, history];
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function removeHistory(id: string) {
  "use server";
  const updatedHistory = Chathistory.filter((history) => history.id !== id);
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function updateHistoryLabel(
  id: string,
  updateFn: (prevLabel: string) => string,
) {
  "use server";
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, label: updateFn(history.label) };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function addMessages(id: string, message: MessageType) {
  "use server";
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, messages: [...history.messages, message] };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

async function updateMessages(
  id: string,
  updateFn: (prevMessages: MessageType[]) => MessageType[],
) {
  "use server";
  const updatedHistory = Chathistory.map((history) => {
    if (history.id === id) {
      return { ...history, messages: updateFn(history.messages) };
    }
    return history;
  });
  cookies().set("chatHistory", JSON.stringify(updatedHistory));
}

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

async function fetchChatHistory() {
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

async function insertChatHistory(data: {
  user: string;
  message: string;
  timestamp: string;
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

async function deleteChatHistory(id: string) {
  "use server";

  const response = await fetch(`${process.env.HOST_URL}/api/chathistory/d`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
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

export interface Message {
  messageID: number;
  display: React.ReactNode;
}

export interface Chat {
  chatID: string;
  messages: Message[];
}

export interface AIState {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}
const initialAIState: AIState[] = [];

const initialUIState: Chat[] = [];

export const AI = createAI({
  actions: {
    changeModel,
    getModelType,
    submitUserMessage,
    handleSendMessage,
    addHistory,
    removeHistory,
    updateHistoryLabel,
    addMessages,
    updateMessages,
    searchDocuments,
    insertChatHistory,
    deleteChatHistory,
    fetchChatHistory,
  },
  initialUIState,
  initialAIState,
});
