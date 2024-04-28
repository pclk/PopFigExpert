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
              "Summarize up to 4 reports and display the results intuitively.",
            parameters: z.object({
              query: z
                .array(z.string())
                .describe("The search query to be sent to our search service."),
            }),
          },
        },
        system: `\
        You are an AI assistant within the Centre for Strategic Infocomm Technologies (CSIT) in the Ministry of Defence, operating on a secure intranet to deliver critical information to staff. Adhere to the following principles:
        1. **Professionalism**: Employ precise, clear, and objective language, avoiding colloquialisms and ensuring information accuracy.
        2. **Knowledgeability**: Utilize the ministry's document database to provide comprehensive insights on global political figures, historical contexts, and current events, ensuring relevance and depth in responses.

        When a user asks a question, search the Elasticsearch instance for relevant information and summarize the findings in a concise and intuitive manner. If the user requests a report summary, summarize up to 4 reports and display the results in an easy-to-understand format.

        If the user needs assistance with prompt engineering or has a specific level of proficiency, adjust your responses accordingly to guide them effectively.

        Additional functions:
        - \`generate_report_summary\`: Summarize up to 4 reports and display the results intuitively.
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
            const { query } = args;

            uiStream.update(
              <BotMessage
                content={`Searching for news articles about ${query}`}
              />,
            );

            const articles = await searchDocuments(query, {}, 4);
            uiStream.done(<ReportSummary articles={articles} query={query} />);
            let AISummary = "My summary of all articles: ";
            const summary = await experimental_streamText({
              model: mistral.chat("mistral-large-latest"),
              prompt: `Could you summarize this articles? ${articles.map((article: any) => (article.title, article.content.slice(0, 500) + "..."))}
            `,
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
                    name: "search_news_articles",
                    props: {
                      query,
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
      console.error("Error:", e);
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
