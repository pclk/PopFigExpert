import "server-only";

import {
  createAI,
  getMutableAIState,
  createStreamableUI,
  getAIState,
} from "ai/rsc";

import {
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from "@/components/ai-ui/message";
import { experimental_streamText, nanoid } from "ai";

import { z } from "zod";
import { Mistral } from "@ai-sdk/mistral";
import { searchDocuments } from "./elastic_action";
import ReportSummary from "@/components/ai-ui/report-sumary";
import type { GroupedDocument } from "@/app/document/document";


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
        content: userInput,
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
                .describe("The content of the document. This is what you should use 95% of the time, unless otherwise specified, to search in the database."),
              title: z
                .string()
                .optional()
                .describe("The title of the document. Instead of using this, you should use content instead, unless specified by the user."),
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
                .describe(
                  "The country the document is about. Use this sparingly, most document's countries are not labelled. Using this may result in no results.",
                ),
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
            const {
              content = undefined,
              title = undefined,
              startDate = undefined,
              endDate = undefined,
              country = undefined,
            } = args;
            console.log("args", args);
            uiStream.update(
              <BotMessage
                content={`Searching for documents with specified parameters: ${[
                  title && `Title: ${title}`,
                  content && `Content: ${content}`,
                  startDate && `Start Date: ${startDate}`,
                  endDate && `End Date: ${endDate}`,
                  country && `Country: ${country}`,
                ]
                  .filter(Boolean)
                  .join(", ")}`}
              />,
            );

            const articles = await searchDocuments(
              content,
              title,
              startDate,
              endDate,
              country,
              4,
            )
            console.log('passing articles to report-summary', articles)
            uiStream.done(<ReportSummary articles={articles} args={args} />);
            let AISummary = `Here is a summary of all ${articles.length} articles: \n\n`;
            if (articles.length === 0) {
              AISummary =
                "I'm sorry, but I couldn't find any articles matching your query. Could you please rephrase your request or provide more specific details?";
              messageStream.update(<BotMessage content={AISummary} />);
            } else {
              const summary = await experimental_streamText({
                model: mistral.chat("mistral-large-latest"),
                prompt: `Could you summarize these articles, with the Title: ${articles.map((article: any) => `${article.title}, and the content: ${article.multiple_chunks.join(" ").substring(0, 500)}...`).join("\n\n")}`,
                maxTokens: 1000,
              });

              for await (const delta of summary.fullStream) {
                const { type } = delta;
                if (type === "text-delta") {
                  const { textDelta } = delta;
                  AISummary += textDelta;
                  messageStream.update(<BotMessage content={AISummary} />);
                }
              }
            }

            aiState.done({
              ...aiState.get(),
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
  initialAIState: { chatID: nanoid(), messages: [] },
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
          message.display?.name === "generate_report_summary" ? (
            <>
              <ReportSummary
                articles={message.display?.props.articles}
                args={message.display?.props.args}
              />
              <BotMessage content={message.content} />
            </>
          ) : (
            <BotMessage content={message.content} />
          )
        ) : (
          <UserMessage>{message.content}</UserMessage>
        ),
    }));
}
