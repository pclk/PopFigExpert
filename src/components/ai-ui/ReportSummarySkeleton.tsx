// components/ReportSummarySkeleton.tsx
import React from "react";

export default function ReportSummarySkeleton() {
  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow-md">
      <div className="mb-8 h-6 w-80 animate-pulse bg-gray-200"></div>
      <div className="mb-2 h-4 w-full animate-pulse bg-gray-200"></div>
      <div className="mb-2 h-4 w-full animate-pulse bg-gray-200"></div>
      <div className="w-90 mb-8 h-4 animate-pulse bg-gray-200"></div>
      <div className="mb-2 h-3 w-60 animate-pulse bg-gray-200"></div>
      <div className="w-70 mb-2 h-3 animate-pulse bg-gray-200"></div>
      <div className="w-50 h-3 animate-pulse bg-gray-200"></div>
    </div>
  );
}
