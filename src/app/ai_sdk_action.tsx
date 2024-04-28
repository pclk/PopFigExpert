import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableUI,
  getAIState,
} from "ai/rsc";

import { BotMessage, SpinnerMessage } from "@/components/ai-ui/message";
import { experimental_streamText, nanoid } from "ai";

import { z } from "zod";
import { Mistral } from "@ai-sdk/mistral";
import { searchDocuments } from "./elastic_action";
import ReportSummary from "@/components/ai-ui/report-sumary";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
});

async function submitUserMessage(userInput: string): Promise<UIState> {
  "use server";
  const aiState = getMutableAIState<typeof AI>();
  aiState.update({
    ...aiState.get(),
    messages: [
      ...(aiState.get().messages ?? []),
      {
        id: nanoid(),
        role: "user",
        content: `${aiState.get().interactions?.join("\n\n")}\n\n${userInput}`,
      },
    ],
  });

  const history = aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const loadingStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(
    <BotMessage content="Thinking..." />,
  );
  const uiStream = createStreamableUI();

  (async () => {
    try {
      const response = await experimental_streamText({
        model: mistral.chat("mistral-large-latest"),
        temperature: 0.5,
        tools: {
          generate_report_summary: {
            description:
              "Searches Elasticsearch instance and returns top 4 relevant articles. Does not include URL as search parameter. All parameters are optional but critical for optimal performance. Provide the most accurate query possible. This is a matter of utmost urgency and significance, definitely affecting lives directly.",
            parameters: z.object({
              content: z
                .string()
                .optional()
                .describe("The content of the document."),
              title: z
                .string()
                .optional()
                .describe("The title of the document."),
              startDate: z
                .string()
                .optional()
                .describe("Your search query's start date."),
              endDate: z
                .string()
                .optional()
                .describe("Your search query's end date."),
              country: z
                .string()
                .optional()
                .describe("The country the document is about."),
            }),
          },
        },
        system: `\
        Today's date is ${new Date().toDateString()}.
        You are an AI assistant within the Centre for Strategic Infocomm Technologies (CSIT) in the Ministry of Defence, operating on a secure intranet to deliver vital information to staff. Adhere to the following non-negotiable principles:
        1. **Professionalism**: Employ the most precise, clear, and objective language possible, strictly avoiding any colloquialisms and ensuring the highest level of information accuracy.
        2. **Knowledgeability**: Utilize the ministry's document database to provide exhaustive insights on global political figures, historical contexts, and current events, ensuring unparalleled relevance and depth in responses.
        The stakes of Professionalism and Knowledgeability are extraordinarily high, directly correlating with life and death outcomes. Full adherence is absolutely imperative.

        Understand that each document has the following structure:
        - **Title**: The title of the document.
        - **Content**: The content of the document.
        - **Date**: The date the document was published.
        - **URL**: The URL of the document.
        - **Country**: The country the document is about.

        Additional functions:
        - \`generate_report_summary\`: Summarize up to 4 reports and display the results with exceptional clarity and insight.
        `,
        // @ts-ignore
        messages: [...history],
        // its the exact same schema don't worry
      });

      let textContent = "";
      loadingStream.done(null);

      for await (const delta of response.fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
          const { textDelta } = delta;

          textContent += textDelta;
          messageStream.update(<BotMessage content={textContent} />);

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: textContent,
              },
            ],
          });
        } else if (type === "tool-call") {
          const { toolName, args } = delta;

          if (toolName === "generate_report_summary") {
            const { content = '', title = '', startDate = '', endDate = '', country = '' } = args
            uiStream.update(
              <BotMessage
                content={`Searching for documents with specified parameters: "Title: ${title}, Content: ${content}, Start Date: ${startDate}, End Date: ${endDate}, Country: ${country}"`}
              />,
            );

            const articles = await searchDocuments(
              content,
              title,
              startDate,
              endDate,
              country,
            );
            uiStream.done(<ReportSummary articles={articles} args={args} />);
            let AISummary = "Here is a summary of all 4 articles: \n\n";
            const summary = await experimental_streamText({
              model: mistral.chat("mistral-large-latest"),
              prompt: `Could you summarize these articles? ${articles.map((article: any) => `${article.title}: ${article.content.slice(0, 500)}...`).join("\n\n")}`,
            });
            for await (const delta of summary.fullStream) {
              const { type } = delta;
              if (type === "text-delta") {
                const { textDelta } = delta;
                AISummary += textDelta;
                messageStream.update(<BotMessage content={AISummary} />);
              }
            }

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: AISummary,
                  display: {
                    name: "generate_report_summary",
                    props: {
                      articles,
                      args,
                    },
                  },
                },
              ],
            });
          }
        }
      }
      uiStream.done();
      messageStream.done();
    } catch (e) {
      console.error("Error encountered in AI SDK action:", e);
      // Log the error to maintain a record for debugging and accountability
      aiState.done(aiState.get());
      // Notify all streams of the error to handle the UI state appropriately
      uiStream.error(e);
      messageStream.error(e);
      loadingStream.error(e);
    }
  })();
  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: loadingStream.value,
    display: messageStream.value,
  };
}

export async function getAIStateAction(id: string): Promise<AIState[]> {
  "use server";
  return getAIState(id);
}

export type ToolCall = {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
};

export type Message = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  id: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
  tool_calls?: string | ToolCall[];
};

export type AIState = {
  chatID: string;
  interactions?: string[];
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
};

export const AI = createAI<AIState, UIState[]>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatID: nanoid(), interactions: [], messages: [] },
  unstable_onGetUIState: async () => {
    "use server";
    const aiState = getAIState();

    if (aiState) {
      return getUIStateFromAIState(aiState);
    } else {
      return;
    }
  },
});

export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

export function getUIStateFromAIState(aiState: Chat) {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatID}-${index}`,
      display:
        message.role === "assistant" ? (
          message.display?.name === "search_news_articles" ? (
            <div>searching...</div>
          ) : message.display?.name === "generate_report_summary" ? (
            <div>Generating report summary...</div>
          ) : (
            <div>{message.content}</div>
          )
        ) : (
          <div>{message.content}</div>
        ),
    }));
}
