// components/DocumentResult.tsx
import React from "react";
import { DocumentType } from "@/lib/validators/DocumentType";

export default function DocumentResult({
  title,
  date,
  country,
  chunk,
  url,
}: DocumentType) {
  console.log("Content in DocumentResult:", chunk);
  return (
    <div className="mb-4 rounded-md bg-white p-4 shadow-md">
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-md mb-1">Date: {`${date}`}</p>
      <p className="text-md mb-2">Country: {country}</p>
      <pre
        className="text-sm"
        style={{ fontFamily: `inherit`, whiteSpace: `pre-wrap` }}
      >
        {chunk}
      </pre>
      <a href={`${url}`} target="_blank" rel="noopener noreferrer">
        🔗
      </a>
      {/* implement highlighting of the search. can save in. scrape mfa again with id */}
    </div>
  );
}
