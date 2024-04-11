// components/ArticlesSkeleton.tsx
import React from "react";

export default function ArticleSkeleton() {
  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow-md">
      <div className="mb-4 h-6 w-60 animate-pulse bg-gray-200"></div>
      <div className="mb-4 h-4 w-40 animate-pulse bg-gray-200"></div>
      <div className="w-30 mb-8 h-4 animate-pulse bg-gray-200"></div>
      <div className="mb-2 h-3 w-full animate-pulse bg-gray-200"></div>
      <div className="mb-2 h-3 w-full animate-pulse bg-gray-200"></div>
      <div className="mb-8 h-3 w-80 animate-pulse bg-gray-200"></div>
      <div className="h-3 w-20 animate-pulse bg-gray-200"></div>
    </div>
  );
}
