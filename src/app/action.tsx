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
import { runOpenAICompletion } from '@/lib/utils';
import { z } from "zod";

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
  cookies().set('modelType', modelType);
}

// Retrieve the modelType value from the cookie on each request
async function getModelType() {
  "use server";
  return cookies().get('modelType')?.value || "gpt-3.5-turbo";
};

async function submitUserMessage(userInput: string): Promise<Message> {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    { role: "user", content: userInput },
  ]);

  const reply = createStreamableUI(
    <div>
      <p>Thinking...</p>
    </div>,
  );

  if (cookies().get("modelType")?.value === "mistralai/mixtral-8x7b-instruct-v0.1") {
    try {
      console.log("Texting mistral", JSON.stringify({ messages: [userInput] }));
      
      const response = await fetch('http://127.0.0.1:3000/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: userInput }] }),
      });

      if (response.ok) {
        const reader = response.body!.getReader();
        let text = '';
      
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            reply.done();
            aiState.done([...aiState.get(), { role: "assistant", content: text }]);
            break;
          }
      
          const chunks = new TextDecoder('utf-8').decode(value).split('"');
          const chunk = chunks.filter((_, index) => index % 2 !== 0).join('');
          text += chunk;
          reply.update(<div>{text}</div>);
          
        }
      } else {
        console.error('Error response from /api/mistral:', response.status, response.statusText);
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        reply.done();
        aiState.done([
          ...aiState.get(),
          { role: "assistant", content: 'An error occurred while processing your request.' }
        ]);
      }
    } catch (error) {
      console.error('Error in submitUserMessage:', error);
      reply.done();
      aiState.done([
        ...aiState.get(),
        { role: "assistant", content: 'An error occurred while processing your request.' }
      ]);
    }
  } else {const completion = runOpenAICompletion(openai, {
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
          query: z.string().describe("The search query provided by the user."),
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
  );}

  return {
    messageID: Date.now(),
    display: reply.value,
  };
} 

export async function getAIStateAction(id: string): Promise<AIState[]> {
  "use server";
  return getAIState(id);

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

async function handleTabChange(prevState: any, formData: FormData
) {
  "use server";
  const tab = formData.get("tab") as string;
  const placeholder =
    tab === "chat" ? "Chat with Eve..." : "Enter a search term...";
  const description =
    tab === "chat"
      ? "Eve can make mistakes. Please check her responses."
      : "Showing results x of xx...";
  return { ...prevState, tab, placeholder, description };
}

async function handleModelChange(prevState: any, formData: FormData
) {
  "use server";

  const model = formData.get("model") as string;
  const modelDisplay =
    model === "gpt-3.5-turbo" ? "GPT 3.5 Turbo" : "Mixtral 7x8b";
  return { ...prevState, modelDisplay };
}

async function handleFilterChange(prevState: any, formData: FormData) {
  "use server";
  const content = formData.get("content") as string;
  const date = formData.get("date") as string;
  const title = formData.get("title") as string;
  const country = formData.get("country") as string;
  return { ...prevState, content, date, title, country };
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
    handleTabChange,
    handleModelChange,
    handleFilterChange,
    addHistory,
    removeHistory,
    updateHistoryLabel,
    addMessages,
    updateMessages,
  },
  initialUIState,
  initialAIState,
});