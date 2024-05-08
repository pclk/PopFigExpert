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
import { searchDocuments, searchProfiles } from "./elastic_action";
import ReportSummary from "@/components/ai-ui/article-summary";
import type { GroupedDocument } from "@/app/elastic_action";
import ArticleSummary from "@/components/ai-ui/article-summary";
import ProfileSummary from "@/components/ai-ui/profile-summary";


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
  console.log("current AI state:", aiState.get())

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
          generate_article_summary: {
            description:
              "Searches Elasticsearch instance and returns top 4 relevant articles. All parameters are optional, and using only the relevant ones will be sufficient. Provide the most accurate query possible. This is a matter of utmost urgency and significance, definitely affecting lives directly.",
            parameters: z.object({
              content: z
                .string()
                .optional()
                .describe("The content of the document. This is what you should use ALL of the time to search in the database, unless otherwise specified"),
              title: z
                .string()
                .optional()
                .describe("The title of the document. Instead of using this, you should use content instead, unless specified by the user."),
              startDate: z
                .string()
                .optional()
                .describe("Article published start date query."),
              endDate: z
                .string()
                .optional()
                .describe("Article published end date query."),
              country: z
                .string()
                .optional()
                .describe(
                  "The country the document is about. Use this sparingly, most document's countries are not labelled. Using this may result in no results.",
                ),
            }),
          },
          generate_profile_summary: {
            description: "Searches Elasticsearch instance and returns top 4 relevant political profiles. All parameters are optional, and using only the relevant ones will be sufficient. Provide the most accurate query possible. This is a matter of utmost urgency and significance, definitely affecting lives directly.",
            parameters: z.object({
              name: z
                .string()
                .optional()
                .describe("The name of the politician. This is what you should use ALL of the time to search in the database, unless otherwise specified."),
              country: z
                .string()
                .optional()
                .describe(
                  "DO NOT USE unless user specifies"),
              gender: z
                .string()
                .optional()
                .describe("DO NOT USE unless user specifies"),
              startDate: z
                .string()
                .optional()
                .describe("Politician's birthday / date of birth."),
              endDate: z
                .string()
                .optional()
                .describe("Politician's date of death."),
              }),
          },
        },
        system: `\
        Today's date is ${new Date().toDateString()}.
        You are an AI assistant within the Centre for Strategic Infocomm Technologies (CSIT) in the Ministry of Defence, operating on a secure intranet to deliver vital information to staff. Adhere to the following non-negotiable principles:
        1. **Professionalism**: Employ the most precise, clear, and objective language possible, strictly avoiding any colloquialisms and ensuring the highest level of information accuracy.
        2. **Knowledgeability**: Utilize the ministry's document database to provide exhaustive insights on global political figures, historical contexts, and current events, ensuring unparalleled relevance and depth in responses.
        The stakes of Professionalism and Knowledgeability are extraordinarily high, directly correlating with life and death outcomes. Full adherence is absolutely imperative.
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

          if (toolName === "generate_article_summary") {
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
                  .filter(Boolean) // removes falsy values
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
            // console.log('passing articles to article-summary', articles)
            uiStream.done(<ArticleSummary articles={articles} args={args} />);
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
                    name: "generate_article_summary",
                    props: {
                      articles,
                      args,
                    },
                  },
                },
              ],
            });
            console.log('updated ai state', aiState.get())
          }
          else if (toolName === "generate_profile_summary") {
            const {
              name = undefined,
              country = undefined,
              gender = undefined,
              startDate = undefined,
              endDate = undefined,
            } = args;
            console.log("args", args);
            uiStream.update(
              <BotMessage
                content={`Searching for documents with specified parameters: ${[
                  name && `Name: ${name}`,
                  country && `Country: ${country}`,
                  gender && `Gender: ${gender}`,
                  startDate && `Start Date: ${startDate}`,
                  endDate && `End Date: ${endDate}`,
                ]
                  .filter(Boolean) // removes falsy values
                  .join(", ")}`}
              />,
            );
            const profiles = await searchProfiles(name, country, gender, startDate, endDate, 4)
            // console.log('passing profile to profile-summary', profiles)
            uiStream.done(<ProfileSummary profiles={profiles} args={args} />);
            let AISummary = `Here is a summary of all ${profiles.length} articles: \n\n`;
            if (profiles.length === 0) {
              AISummary =
                "I'm sorry, but I couldn't find any articles matching your query. Could you please rephrase your request or provide more specific details?";
              messageStream.update(<BotMessage content={AISummary} />);
            } else {
              const profileString = profiles.map((profile: any) => {
                return Object.entries(profile).map(([key, value]) => {
                  if (key === "positionsHeld" && Array.isArray(value)) {
                    return `${key}: ` + value.map(position => {
                      return Object.entries(position).map(([posKey, posValue]) => `${posKey}: ${posValue}`).join(', ');
                    }).join('; ');
                  }
                  return `${key}: ${value}`;
                }).join(', ');
              }).join("\n\n");

              const summary = await experimental_streamText({
                model: mistral.chat("mistral-large-latest"),
                prompt: `Could you summarize these profiles, with the details: ${profileString}`,
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
                    name: "generate_profile_summary",
                    props: {
                      profiles,
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
