// components/ReportSummary.tsx
import React from "react";

export default function ReportSummary({ summary }: { summary: string }) {
  return (
    <div className="rounded-md bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Report Summary</h2>
      <p className="text-base">{summary}</p>
    </div>
  );
}
