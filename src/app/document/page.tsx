// app/document/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchDocuments } from "@/app/action";
import ChatInput from "@/components/chatbot/ChatInput";

interface GroupedDocuments {
  date: string;
  country: string;
  title: string;
  url: string;
  multiple_chunks: string[];
}

export default function DocumentSearch() {
  const searchParams = useSearchParams()!;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedDocuments[]>([]);
  const [placeholder, _] = useState("Enter a search term...");
  const [description, setDescription] = useState("");
  const [filters, setFilters] = useState({
    content: "",
    date: "",
    title: "",
    country: "",
  });

  useEffect(() => {
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      setQuery(searchTerm);
      handleSearch(searchTerm, filters);
    }
  }, [searchParams]);

  const handleSearch = (searchTerm: string, filters: any) => {
    searchDocuments(searchTerm, filters)
      .then((results) => {
        const groupedDocuments = groupDocumentsByUrl(results);
        setResults(groupedDocuments);
        setDescription(`Showing ${groupedDocuments.length} document(s)`);
      })
      .catch((error) => {
        console.error("Error searching documents:", error);
        // Handle the error state if needed
      });
  };

  const handleSendMessage = (userInput: string) => {
    setQuery(userInput);
    handleSearch(userInput, filters);
  };

  const groupDocumentsByUrl = (results: any[]): GroupedDocuments[] => {
    const groupedDocuments: GroupedDocuments[] = [];
    const urlMap: { [url: string]: GroupedDocuments } = {};

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

  return (
    <div>
      <div className="mb-4">
        <div className="mb-2 text-xl font-bold">
          Let's look through some documents ourselves
        </div>
        <div className="mb-4 text-sm text-gray-500">
          These are the fields available to search by:
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <textarea
            className="w-full resize-none overflow-hidden rounded-sm border border-primary p-2 text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Content"
            value={filters.content}
            onChange={(e) =>
              setFilters({ ...filters, content: e.target.value })
            }
          />
          <textarea
            className="w-full resize-none overflow-hidden rounded-sm border border-primary p-2 text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
          <textarea
            className="w-full resize-none overflow-hidden rounded-sm border border-primary p-2 text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Title"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />
          <textarea
            className="w-full resize-none overflow-hidden rounded-sm border border-primary p-2 text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
            placeholder="Country"
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
          />
        </div>
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        placeholder={placeholder}
        description={description}
      />
      {results.map((doc, index) => (
        <div key={index}>
          <h3>{doc.title}</h3>
          <p>
            URL: <a href={doc.url}>{doc.url}</a>
          </p>
          <p>Date: {`${doc.date}`}</p>
          <p>Country: {doc.country}</p>
          {doc.multiple_chunks.map((chunk, chunkIndex) => (
            <div
              key={chunkIndex}
              className="m-3 block border border-solid border-black p-4"
            >
              {chunk.slice(0, 500) + "..."}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
