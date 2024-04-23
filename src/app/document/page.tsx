"use client";
// app/document/page.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import ChatInput from "@/components/ChatInput";
import { useActions } from "ai/rsc";
import TextareaAutosize from "react-textarea-autosize";
import Highlighter from "react-highlight-words";
import { type FindChunks, Chunk } from "react-highlight-words";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { format } from "date-fns";

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

export default function DocumentSearch() {
  const searchParams = useSearchParams()!;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedDocument[]>([]);
  const [description, setDescription] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    content: "",
    date: "",
    title: "",
    country: "",
  });
  const { searchDocuments } = useActions();

  useEffect(() => {
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      setQuery(searchTerm);
      handleSearch(searchTerm, filters);
    }
  }, [searchParams]);

  const handleSearch = (searchTerm: string, filters: any) => {
    const { dateRange, ...otherFilters } = filters;
    const searchFilters = {
      ...otherFilters,
      dateFrom: dateRange?.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined,
      dateTo: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    };

    searchDocuments(searchTerm, searchFilters)
      .then((results: SearchResult[]) => {
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
        // Handle the error state if needed
      });
  };

  const handleSendMessage = (userInput: string) => {
    setQuery(userInput);
    handleSearch(userInput, filters);
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
      autoEscape,
      caseSensitive,
      sanitize,
      searchWords,
      textToHighlight,
    } = options;
    const chunks: Chunk[] = [];
    const words = textToHighlight.split(/[\s"']+/);

    words.forEach((word: string, index: number) => {
      const startIndex = textToHighlight.indexOf(
        word,
        index === 0 ? 0 : chunks[chunks.length - 1]?.end || 0,
      );
      const endIndex = startIndex + word.length;

      const matches = searchWords.some((searchWord) => {
        if (searchWord instanceof RegExp) {
          return searchWord.test(word);
        } else {
          return caseSensitive
            ? searchWord === word
            : searchWord.toLowerCase() === word.toLowerCase();
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
                searchWords={query.split(" ")}
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
                  searchWords={query.split(" ")}
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
              className="text-sm"
            >
              🔗 {`${doc.url}`}
            </a>
          </div>
        ))}
        <div className="sticky bottom-0 left-0 w-full bg-white">
          <div className="mb-2">
            <button
              className="rounded-sm border-0 bg-secondary p-2 text-sm text-darkprim transition-all duration-75 hover:bg-primary  active:text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          {showFilters && (
            <div className="mb-4">
              <div className="grid grid-rows-1 gap-4 lg:grid-cols-3">
                <DatePickerWithRange
                  className="rounded-sm border border-primary font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                  onDateRangeChange={(e) =>
                    setFilters({ ...filters, content: e.target.value })
                  }
                />
                <TextareaAutosize
                  className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Title"
                  value={filters.title}
                  onChange={(e) =>
                    setFilters({ ...filters, title: e.target.value })
                  }
                />
                <TextareaAutosize
                  className="resize-none overflow-hidden rounded-sm border border-primary p-2 font-inter text-sm text-darkprim outline-none transition-all duration-75 focus:ring-2 focus:ring-primary"
                  placeholder="Country"
                  value={filters.country}
                  onChange={(e) =>
                    setFilters({ ...filters, country: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <ChatInput
            submitMessage={handleSendMessage}
            placeholder={"Enter your content..."}
            description={description}
            clearInput={false}
          />
        </div>
      </div>
    </div>
  );
}
