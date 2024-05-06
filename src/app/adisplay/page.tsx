import ReportSummary from "@/components/ai-ui/report-sumary";
import { UserMessage } from "@/components/ai-ui/message";
import { BotMessage } from "@/components/ai-ui/message";
import { ChatInput } from "../chat/[chatId]/chat-input";

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
    <div className="flex h-[calc(100%-20px-1.25rem-20px-2px)] grow flex-col space-y-6 overflow-y-auto">
      <UserMessage>"Hello can i get ai summary"</UserMessage>
      <ReportSummary articles={example} args={{ content: "AI summary" }} />
      <BotMessage
        content="Here is a summary of all 4 articles:

Title: Prime Minister Lee Hsien Loong's Telephone Call with Australian Prime Minister Scott Morrison, 16 September 2021 Summary: Prime Minister Lee Hsien Loong received a call from Australian Prime Minister Scott Morrison, who briefed him about the newly-formed AUKUS partnership among Australia, the UK, and the US. PM Lee acknowledged the long-standing relations Singapore has with these countries and expressed hope that AUKUS would contribute positively to regional peace and stability.

Title: Official Visit of His Excellency Sheikh Mohammed Bin Abdulrahman Bin Jassim Al Thani, Prime Minister and Minister of Foreign Affairs of the State of Qatar, 23 to 25 August 2023 Summary: Sheikh Mohammed Bin Abdulrahman Bin Jassim Al Thani, Prime Minister and Minister of Foreign Affairs of Qatar, will visit Singapore from 23 to 25 August 2023. This will be his first visit as Prime Minister. An official welcome ceremony will be held at the Istana, and he will meet with President Halimah Yacob and Prime Minister Lee Hsien Loong.

Title: Visit of the Prime Minister of Australia, The Honourable Scott Morrison MP, 10 June 2021 Summary: Australian Prime Minister Scott Morrison visited Singapore on 10 June 2021 for the 6th Singapore-Australia Leaders’ Meeting. He met with Prime Minister Lee Hsien Loong at the Istana and they held a virtual Joint Press Conference. The annual meeting discusses bilateral cooperation and exchanges under the Singapore-Australia Comprehensive Strategic Partnership.

Title: Visit of the Honourable Patrick Gorman MP, Assistant Minister to the Prime Minister and Assistant Minister for the Public Service of Australia Under the S R Nathan Fellowship, 2 to 5 July 2023 Summary: Patrick Gorman, Assistant Minister to the Australian Prime Minister and Assistant Minister for the Public Service, will visit Singapore from 2 to 5 July 2023 under the S R Nathan Fellowship. He will be hosted for dinner by Minister for Foreign Affairs Dr. Vivian Balakrishnan and meet with various Singaporean ministers."
      />
    </div>
  );
}
