import ReportSummary from "@/components/ai-ui/report-sumary";

export default function IndexPage() {
  const example = [
    {
      title: "AI in Singaporein SingapAI in Chinaorein Singaporein Singapore in Singaporein Singaporein Singapore",
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

  return <ReportSummary articles={example} />;
}
