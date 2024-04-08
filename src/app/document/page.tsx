// app/document/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchDocuments } from '../actions';
import ChatInput from '@/components/chatbot/ChatInput';
import { Card } from '@/components/ui/card';

interface GroupedDocuments {
  date: string;
  country: string;
  title: string;
  url: string;
  multiple_chunks: string[];
}

export default function DocumentSearch() {
  const searchParams = useSearchParams()!;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GroupedDocuments[]>([]);
  const [placeholder, _] = useState('Enter a search term...');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      setQuery(searchTerm);
      handleSearch(searchTerm);
    }
  }, [searchParams]);

  const handleSearch = async (searchTerm: string) => {
    const results = await searchDocuments(searchTerm);
    const groupedDocuments = groupDocumentsByUrl(results);
    setResults(groupedDocuments);
    setDescription(`Showing ${groupedDocuments.length} document(s)`);
  };

  const handleSendMessage = (userInput: string) => {
    setQuery(userInput);
    handleSearch(userInput);
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
      <ChatInput
        onSendMessage={handleSendMessage}
        isPending={false}
        isError={false}
        error={null}
        placeholder={placeholder}
        description={description}
      />
      {results.map((doc, index) => (
        <div key={index}>
          <h3>{doc.title}</h3>
          <p>URL: <a href={doc.url}>{doc.url}</a></p>
          <p>Date: {`${doc.date}`}</p>
          <p>Country: {doc.country}</p>
          {doc.multiple_chunks.map((chunk, chunkIndex) => (
            <Card key={chunkIndex} className="block m-3 border-solid border-black p-4">
              {chunk.slice(0, 500) + "..."}
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}