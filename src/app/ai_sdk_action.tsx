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
import { experimental_generateText, experimental_streamText, nanoid } from "ai";
import { MessageType } from "../lib/validators/MessageType";
import { cookies } from "next/headers";
import { runOpenAICompletion } from "@/lib/utils";
import { z } from "zod";
import { Mistral } from "@ai-sdk/mistral";
import { searchDocuments } from "./elastic_action";
import ReportSummary from "@/components/ai-ui/report-sumary";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || "",
});

async function submitUserMessage(
  userInput: string,
  model: string,
): Promise<UIState> {
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

  const loadingStream = createStreamableUI(
    <div>
      <p>Thinking...</p>
    </div>,
  );
  const messageStream = createStreamableUI(null);
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
          messageStream.update(<div>{textContent}</div>);

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
              <div>
                <p>{`Searching for news articles about ${query}...`}</p>
              </div>,
            );

            const articles = await searchDocuments(query, {}, 4);
            uiStream.done(<ReportSummary articles={articles} />);
            let AISummary = "";
            const summary = await experimental_streamText({
              model: mistral.chat("mistral-large-latest"),
              prompt: `Could you summarize this articles? ${articles.map((article) => (article.title, article.content.slice(0, 500) + "..."))}
            `,
            });
            for await (const delta of summary.fullStream) {
              const {type} = delta
              if (type === 'text-delta') {
                const {textDelta} = delta
                AISummary += textDelta
                messageStream.update(<div>{AISummary}</div>)
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
          } else if (toolName === "yeah you're never going to reach me") {
            uiStream.update(
              <div>
                <p>Sorry this feature isn't available yet 💩...</p>
              </div>,
            );

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: `Here is a summary of the reports: ${reportIds.join(", ")}`,
                  display: {
                    name: "generate_report_summary",
                    props: {
                      reportIds,
                    },
                  },
                },
              ],
            });
          }
        }
        uiStream.done();
        messageStream.done();
      }
    } catch (e) {
      console.error(e);
    }
  })();
  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: loadingStream.value,
    display: messageStream.value,
  };
}

// if (
//   model === "mistralai/mixtral-8x7b-instruct-v0.1"
// ) {
//   try {
//     console.log("Texting mistral", JSON.stringify({ messages: [userInput] }));

//     const response = await fetch("http://127.0.0.1:3000/api/mistral", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         messages: [{ role: "user", content: userInput }],
//       }),
//     });

//     if (response.ok) {
//       const reader = response.body!.getReader();
//       let text = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) {
//           reply.done();
//           aiState.done([
//             ...aiState.get(),
//             { role: "assistant", content: text },
//           ]);
//           break;
//         }

//         const chunks = new TextDecoder("utf-8").decode(value).split('"');
//         const chunk = chunks.filter((_, index) => index % 2 !== 0).join("");
//         text += chunk;
//         reply.update(<div>{text}</div>);
//       }
//     } else {
//       console.error(
//         "Error response from /api/mistral:",
//         response.status,
//         response.statusText,
//       );
//       try {
//         const errorData = await response.json();
//         console.error("Error details:", errorData);
//       } catch (parseError) {
//         console.error("Failed to parse error response:", parseError);
//       }
//       reply.done();
//       aiState.done([
//         ...aiState.get(),
//         {
//           role: "assistant",
//           content: "An error occurred while processing your request.",
//         },
//       ]);
//     }
//   } catch (error) {
//     console.error("Error in submitUserMessage:", error);
//     reply.done();
//     aiState.done([
//       ...aiState.get(),
//       {
//         role: "assistant",
//         content: "An error occurred while processing your request.",
//       },
//     ]);
//   }
// } else {
//   const completion = runOpenAICompletion(openai, {
//     model: "gpt-3.5-turbo",
//     stream: true,
//     messages: [
//       {
//         role: "system",
//         content: `\
// You are an AI assistant within the Centre for Strategic Infocomm Technologies (CSIT) in the Ministry of Defence, operating on a secure intranet to deliver critical information to staff. Adhere to the following principles:
// 1. **Professionalism**: Employ precise, clear, and objective language, avoiding colloquialisms and ensuring information accuracy.
// 2. **Knowledgeability**: Utilize the ministry's document database to provide comprehensive insights on global political figures, historical contexts, and current events, ensuring relevance and depth in responses.

// When a user asks a question, search the Elasticsearch instance for relevant information and summarize the findings in a concise and intuitive manner. If the user requests a report summary, summarize up to 4 reports and display the results in an easy-to-understand format.

// If the user needs assistance with prompt engineering or has a specific level of proficiency, adjust your responses accordingly to guide them effectively.

// Additional functions:
// - \`search_news_articles\`: Search for relevant news articles based on the user's query.
// - \`generate_report_summary\`: Summarize up to 4 reports and display the results intuitively.
// `,
//       },
//       ...aiState.get().map((info: any) => ({
//         role: info.role,
//         content: info.content,
//         name: info.name,
//       })),
//     ],
//     functions: [
//       {
//         name: "search_news_articles",
//         description:
//           "Search for relevant news articles based on the user's query.",
//         parameters: z.object({
//           query: z
//             .string()
//             .describe("The search query provided by the user."),
//         }),
//       },
//       {
//         name: "generate_report_summary",
//         description:
//           "Summarize up to 4 reports and display the results intuitively.",
//         parameters: z.object({
//           reportIds: z
//             .array(z.string())
//             .describe("The IDs of the reports to summarize."),
//         }),
//       },
//     ],
//     temperature: 0,
//   });

//   completion.onTextContent((content: string, isFinal: boolean) => {
//     reply.update(<div>{content}</div>);
//     if (isFinal) {
//       reply.done();
//       aiState.done([...aiState.get(), { role: "assistant", content }]);
//     }
//   });

//   completion.onFunctionCall("search_news_articles", async ({ query }) => {
//     reply.update(
//       <div>
//         <div>searching..</div>
//       </div>,
//     );

//     // const articles = await searchDocuments(query, {});

//     reply.done(
//       <div>
//         <div>3articles</div>
//       </div>,
//     );

//     aiState.done([
//       ...aiState.get(),
//       {
//         role: "function",
//         name: "search_news_articles",
//         content: JSON.stringify("user got articles"),
//       },
//     ]);
//   });

//   completion.onFunctionCall(
//     "generate_report_summary",
//     async ({ reportIds }) => {
//       reply.update(
//         <div>
//           <div>Generating report summary...</div>
//         </div>,
//       );

//       // const reports = await Promise.all(
//       //   reportIds.map((id) => getChatHistory(id)),
//       // );
//       // const summary = generateReportSummary(reports);

//       reply.done(<div>summary</div>);

//       aiState.done([
//         ...aiState.get(),
//         {
//           role: "function",
//           name: "generate_report_summary",
//           content: JSON.stringify("user got report summary"),
//         },
//       ]);
//     },
//   );
// }

//   return {
//     id: nanoid(),
//     attachments: uiStream.value,
//     spinner: loadingStream,
//     display: messageStream.value,
//   };
// }

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
