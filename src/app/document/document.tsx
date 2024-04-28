"use client";
// app/document/page.tsx
import { useState } from "react";
import Highlighter from "react-highlight-words";
import { type FindChunks, Chunk } from "react-highlight-words";
import DocumentSearch from "./document-search";
import { useQueryState } from "nuqs";
import { searchDocuments } from "@/app/elastic_action";

interface SearchResult {
  date: string;
  title: string;
  url: string;
  country: string;
  content: string;
}

interface GroupedDocument {
  title: string;
  date: string;
  country: string;
  url: string;
  multiple_chunks: string[];
}

export default function Document() {
  const [results, setResults] = useState<GroupedDocument[]>([]);
  const [description, setDescription] = useState("Start entering your search query...");
  const [startDate, _1] = useQueryState("startDate");
  const [endDate, _2] = useQueryState("endDate");
  const [contentFilter, _3] = useQueryState("content");
  const [titleFilter, _4] = useQueryState("title");
  const [countryFilter, _5] = useQueryState("country");


  function handleSearch () {
    searchDocuments(
      contentFilter ?? undefined, 
      startDate ? new Date(startDate).toISOString() : undefined, 
      endDate ? new Date(endDate).toISOString() : undefined, 
      countryFilter ?? undefined, 
      titleFilter ?? undefined
    )      .then((results: SearchResult[]) => {
      console.log("Results:", results);
        const groupedDocuments: GroupedDocument[] =
          groupDocumentsByUrl(results);
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
  };

  const groupDocumentsByUrl = (results: any[]): GroupedDocument[] => {
    const groupedDocuments: GroupedDocument[] = [];
    const urlMap: { [url: string]: GroupedDocument } = {};

    results.forEach((doc) => {
      const { date, title, url, country, content } = doc;
      if (urlMap[url]) {
        urlMap[url].multiple_chunks.push(content);
      } else {
        urlMap[url] = {
          title: title,
          date: date,
          country: country,
          url: url,
          multiple_chunks: [content],
        };
      }
    });
    

    Object.values(urlMap).forEach((doc) => {
      groupedDocuments.push(doc);
    });

    return groupedDocuments;
  };

  const findWholeWordMatches = (options: FindChunks): Chunk[] => {
    const {
      searchWords,
      textToHighlight,
    } = options;
    const chunks: Chunk[] = [];
    const words = textToHighlight.toLowerCase().split(/[\s"'\-()]+/);
  
    words.forEach((word: string, index: number) => {
      const startIndex = textToHighlight.toLowerCase().indexOf(
        word,
        index === 0 ? 0 : chunks[chunks.length - 1]?.end || 0,
      );
      const endIndex = startIndex + word.length;
  
      const matches = searchWords.some((searchWord) => {
        if (searchWord instanceof RegExp) {
          return new RegExp(searchWord, 'i').test(word);
        } else {
          return searchWord.toLowerCase() === word;
        }
      });
  
      if (matches) {
        chunks.push({ start: startIndex, end: endIndex });
      }
    });
  
    return chunks;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-y-auto">
        {results.map((doc, index) => (
          <div key={index} className="mb-4 rounded-md bg-white p-4 shadow-md">
            <div>
              <Highlighter
                searchWords={(titleFilter ?? '').split(" ")}
                textToHighlight={doc.title}
                autoEscape={true}
                className="text-lg font-bold"
                highlightClassName="bg-darkprim text-white"
                findChunks={findWholeWordMatches}
              />
            </div>
            <p className="text-md m-0 ">Date: {`${doc.date}`}</p>
            <p className="text-md m-0 ">Country: {doc.country}</p>
            {doc.multiple_chunks.map((chunk, chunkIndex) => (
              <pre
                key={chunkIndex}
                className="m-0 overflow-hidden text-ellipsis whitespace-pre-wrap font-inter text-sm"
              >
                <Highlighter
                  searchWords={(contentFilter ?? '').split(" ")}
                  textToHighlight={chunk.slice(0, 200)}
                  autoEscape={true}
                  highlightClassName="bg-darkprim text-white"
                  findChunks={findWholeWordMatches}
                />{" "}
                {chunk.length > 500 && "..."}
              </pre>
            ))}
            <a
              href={`${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm">
              🔗 {`${doc.url}`}
            </a>
          </div>
        ))}
      </div>
      <DocumentSearch description={description} handleSubmit={handleSearch} />
    </div>
  );
}
