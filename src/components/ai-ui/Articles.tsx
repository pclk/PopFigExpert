// components/Articles.tsx
import React from "react";

export default function Articles({ articles }: { articles: any[] }) {
  return (
    <div>
      {articles.map((article, index) => (
        <div key={index} className="mb-4 rounded-md bg-white p-4 shadow-md">
          <h2 className="mb-2 text-lg font-bold">{article.title}</h2>
          <p className="mb-2 text-sm text-gray-500">Date: {article.date}</p>
          <p className="mb-4 text-sm text-gray-500">
            Country: {article.country}
          </p>
          <p className="text-base">{article.content}</p>
        </div>
      ))}
    </div>
  );
}
