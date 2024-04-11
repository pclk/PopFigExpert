import "server-only";

import client from "@/lib/elasticsearch";
import { OpenAI } from "openai";
import { createAI, getMutableAIState, createStreamableUI } from "ai/rsc";
import { z } from "zod";
import { BotMessage, BotCard } from "@/components/ai-ui/message";
import { spinner } from "@/components/ai-ui/spinner";
import { runOpenAICompletion } from "@/lib/utils";
import ReportSummarySkeleton from "@/components/ai-ui/ReportSummarySkeleton";
import ArticlesSkeleton from "@/components/ai-ui/ArticlesSkeleton";
// import ReportSummary from "@/components/ai-ui/ReportSummary";
import Articles from "@/components/ai-ui/Articles";
import { AI } from "./ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content,
    },
  ]);

  const reply = createStreamableUI(
    <BotMessage className="items-center">{spinner}</BotMessage>,
  );

  const completion = runOpenAICompletion(openai, {
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "system",
        content: `
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
    reply.update(<BotMessage>{content}</BotMessage>);
    if (isFinal) {
      reply.done();
      aiState.done([...aiState.get(), { role: "assistant", content }]);
    }
  });

  completion.onFunctionCall("search_news_articles", async ({ query }) => {
    reply.update(
      <BotCard>
        <ArticlesSkeleton />
      </BotCard>,
    );

    const articles = await searchDocuments(query, {});

    reply.done(
      <BotCard>
        <Articles articles={articles} />
      </BotCard>,
    );

    aiState.done([
      ...aiState.get(),
      {
        role: "function",
        name: "search_news_articles",
        content: JSON.stringify(articles),
      },
    ]);
  });

  completion.onFunctionCall(
    "generate_report_summary",
    async ({ reportIds }) => {
      reply.update(
        <BotCard>
          <ReportSummarySkeleton />
        </BotCard>,
      );

      const reports = await Promise.all(
        reportIds.map((id) => getChatHistory(id)),
      );
      const summary = generateReportSummary(reports);

      reply.done(<BotCard>summary</BotCard>);

      aiState.done([
        ...aiState.get(),
        {
          role: "function",
          name: "generate_report_summary",
          content: JSON.stringify(summary),
        },
      ]);
    },
  );

  return {
    id: Date.now(),
    display: reply.value,
    isUser: true,
  };
}

// Search documents with filter parameters
export async function searchDocuments(query: string, filters: any) {
  "use server";
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
        multi_match: { query: date, fields: ["date"] },
      });
    }

    if (country) {
      must.push({
        multi_match: { query: country, fields: ["country"] },
      });
    }

    if (title) {
      must.push({
        multi_match: { query: title, fields: ["title"] },
      });
    }

    const response = await client.search({
      index: "mfa-press",
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
    });

    return response.hits.hits.map((hit: any) => hit._source);
  } catch (error) {
    console.error("Error searching documents:", String(error).slice(0, 50));
    throw new Error(
      "An error occurred while searching documents. Please try again later.",
    );
  }
}

// // CRUD operations for chat history data
// async function createChatHistory(history: any) {
//   try {
//     await client.index({
//       index: "chathist",
//       body: history,
//     });
//   } catch (error) {
//     console.error("Error creating chat history:", String(error).slice(0, 50));
//     throw new Error(
//       "An error occurred while creating chat history. Please try again later.",
//     );
//   }
// }

export async function getChatHistory(id: string) {
  try {
    const response = await client.get({
      index: "chathist",
      id: id,
    });
    return response._source;
  } catch (error) {
    console.error("Error retrieving chat history:", String(error).slice(0, 50));
    throw new Error(
      "An error occurred while retrieving chat history. Please try again later.",
    );
  }
}

// async function updateChatHistory(id: string, history: any) {
//   try {
//     await client.update({
//       index: "chathist",
//       id: id,
//       body: {
//         doc: history,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating chat history:", String(error).slice(0, 50));
//     throw new Error(
//       "An error occurred while updating chat history. Please try again later.",
//     );
//   }
// }

// async function deleteChatHistory(id: string) {
//   try {
//     await client.delete({
//       index: "chathist",
//       id: id,
//     });
//   } catch (error) {
//     console.error("Error deleting chat history:", String(error).slice(0, 50));
//     throw new Error(
//       "An error occurred while deleting chat history. Please try again later.",
//     );
//   }
// }

// Generate report summary (placeholder function)
export async function generateReportSummary(reports: any[]) {
  // Placeholder implementation, replace with actual summary generation logic
  return `Summary of ${reports.length} reports`;
}
