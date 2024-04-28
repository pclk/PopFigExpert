import ReportSummary from "@/components/ai-ui/report-sumary";
import { UserMessage } from "@/components/ai-ui/message";
import { BotMessage } from "@/components/ai-ui/message";

export default function IndexPage() {
  const example = [
    {
      title:
        "AI in Singaporein SingapAI in Chinaorein Singaporein Singapore in Singaporein Singaporein Singapore",
      date: "2021-09-01",
      country: "Singapore",
      content:
        "Singapore is a great place to learn AI.  Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered. Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered. e to learn AI.  Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered. Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted e to learn AI.  Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered. Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted e to learn AI.  Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered. Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted ",
    },
    {
      title: "AI in ChinaAI in ChinaAI in China",
      date: "2021-09-02",
      country: "China",
      content: "China is a great place to learn AI.",
    },
    {
      title: "AI in IndiaAI in ChinaAI in ChinaAI in ChinaAI in China",
      date: "2021-09-03",
      country: "India",
      content:
        "India is a great place to learn AI.  Columns are where you define the core of what your table will look like. They define the data that will be displayed, how it will be formatted, sorted and filtered.",
    },
    {
      title: "AI in JapanAI in ChinaAI in ChinaAI in China",
      date: "2021-09-04",
      country: "Japan",
      content: "Japan is a great place to learn AI.",
    },
  ];

  return (
    <div className="flex h-[calc(100%-20px-1.25rem-20px-2px)] grow flex-col space-y-6">
      <UserMessage>"Hello can i get ai summary"</UserMessage>
      <ReportSummary articles={example} query="AI summary" />
      <BotMessage content="Hello i am AI, and i have `markdown` lol" />
    </div>
  );
}
