"use client";
// app/document/page.tsx
import { useEffect, useState } from "react";
import DocumentSearch from "./document-search";
import { useQueryState } from "nuqs";
import { searchDocuments } from "@/app/elastic_action";
import { useArticleSearch } from "@/app/stores";


export type GroupedDocument = {
  title: string;
  highlight_title: string;
  date: string;
  country: string;
  url: string;
  multiple_chunks: string[];
  multiple_highlight_chunks: string[];
}

interface Props {
  content?: string;
  title?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
}

export default function Document({
  content,
  title,
  country,
  startDate,
  endDate,
}: Props) {
  const [results, setResults] = useState<GroupedDocument[]>([]);
  const [description, setDescription] = useState(
    "Start entering your search query...",
  );
  

  useEffect(() => {
    handleSearch();
  }, [content, startDate, endDate, country, title]);

  function handleSearch() {
    searchDocuments(
      content ?? undefined,
      title ?? undefined,
      startDate ?? undefined,
      endDate ?? undefined,
      country ?? undefined,
    )
      .then((groupedDocuments: GroupedDocument[]) => {
        if (groupedDocuments.length === 0) {
          setResults(groupedDocuments);
          setDescription("No documents found.");
        } else {
          setResults(groupedDocuments);
          console.log(results)
          setDescription(`Showing ${groupedDocuments.length} document(s)`);
        }
      })
      .catch((error: Error) => {
        console.error("Error searching documents:", error);
      });
  }

  return (
    <div className="flex h-full flex-col">
      <h2>{description}</h2>
      <div className="flex-grow overflow-y-auto">
        {results.map((doc, index) => (
          <div key={index} className="mb-4 rounded-md bg-white p-4 shadow-md">
            <div>
              <div
                className="text-xl font-bold"
                dangerouslySetInnerHTML={{
                  __html: doc.highlight_title ?? doc.title,
                }}
              ></div>
            </div>
            {doc.date && <p className="mb-2 mt-0 text-lg ">Date: {`${doc.date}`}</p>}
            {doc.country && <p className="mb-2 mt-0 text-lg ">Country: {doc.country}</p>}
            {doc.multiple_chunks.map((chunk, chunkIndex) => (
              <pre
                key={chunkIndex}
                id={chunkIndex.toString()}
                className="text-md mt-2 overflow-hidden text-ellipsis whitespace-pre-wrap rounded-md bg-secondary p-2 font-inter shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: doc.multiple_highlight_chunks[chunkIndex] ?? chunk,
                }}
              ></pre>
            ))}
            <a
              href={`${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              🔗 {`${doc.url}`}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
