"use client";
// app/document/page.tsx
import { useEffect, useState } from "react";
import DocumentSearch from "./document-search";
import { useQueryState } from "nuqs";
import { searchDocuments } from "@/app/elastic_action";

interface SearchResult {
  date: string;
  title: string;
  url: string;
  country: string;
  content: string;
  highlight_title: string;
  highlight_content: string;
}

interface GroupedDocument {
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
  const [startDateFilter, setStartDate] = useQueryState("startDate");
  const [endDateFilter, setEndDate] = useQueryState("endDate");
  const [contentFilter, setContentFilter] = useQueryState("content");
  const [titleFilter, setTitleFilter] = useQueryState("title");
  const [countryFilter, setCountryFilter] = useQueryState("country");

  useEffect(() => {
    handleSearch();
  }, []);

  function handleSearch() {
    searchDocuments(
      contentFilter ?? content ?? undefined,
      startDateFilter ?? startDate ?? undefined,
      endDateFilter ?? endDate ?? undefined,
      countryFilter ?? country ?? undefined,
      titleFilter ?? title ?? undefined,
    )
      .then((results: any) => {
        const combinedResults: SearchResult[] = results.map((result: any) => ({
          ...result._source, // Spread the non-highlighted data
          highlight_title: result.highlight.title,
          highlight_content: result.highlight.content,
        }));

        console.log("combinedResults", combinedResults);
        const groupedDocuments: GroupedDocument[] =
          groupDocumentsByUrl(combinedResults);
        if (groupedDocuments.length === 0) {
          setResults(groupedDocuments);
          setDescription("No documents found.");
        } else {
          setResults(groupedDocuments);
          setDescription(`Showing ${groupedDocuments.length} document(s)`);
        }
      })
      .catch((error: Error) => {
        console.error("Error searching documents:", error);
      });
  }

  const groupDocumentsByUrl = (results: any[]): GroupedDocument[] => {
    const groupedDocuments: GroupedDocument[] = [];
    const urlMap: { [url: string]: GroupedDocument } = {};

    results.forEach((doc) => {
      const {
        date,
        title,
        url,
        country,
        content,
        highlight_content,
        highlight_title,
      } = doc;
      if (urlMap[url]) {
        urlMap[url].multiple_chunks.push(content);
        urlMap[url].multiple_highlight_chunks.push(highlight_content);
      } else {
        urlMap[url] = {
          title: title,
          highlight_title: highlight_title,
          date: date,
          country: country,
          url: url,
          multiple_highlight_chunks: [highlight_content],
          multiple_chunks: [content],
        };
      }
    });

    Object.values(urlMap).forEach((doc) => {
      groupedDocuments.push(doc);
    });

    return groupedDocuments;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-y-auto">
        {results.map((doc, index) => (
          <div key={index} className="mb-4 rounded-md bg-white p-4 shadow-md">
            <div>
              <div
                className="text-xl font-bold"
                dangerouslySetInnerHTML={{
                  __html: doc.highlight_title ? doc.highlight_title : doc.title,
                }}
              ></div>
            </div>
            <p className="m-0 text-lg ">Date: {`${doc.date}`}</p>
            <p className="mb-2 mt-0 text-lg ">Country: {doc.country}</p>
            {doc.multiple_chunks.map((chunk, chunkIndex) => (
              <pre
                key={chunkIndex}
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
      <DocumentSearch description={description} handleSubmit={handleSearch} />
    </div>
  );
}
