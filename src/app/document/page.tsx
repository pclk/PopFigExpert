// app/page.tsx
'use client'

import { useState } from 'react'
import { searchDocuments } from '../actions'
import DocumentResult from '@/components/DocumentResult'

export default function Home() {
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<any[]>([]) // Provide the correct type for the documents state variable

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const results = await searchDocuments(query)
    setDocuments(results)
    console.log(results[0].content)
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
        />
        <button type="submit">Search</button>
      </form>
      {documents.map((doc) => (
        <DocumentResult
          id={doc.id}
          title={doc.title}
          date={doc.date}
          country={doc.country}
          content={doc.content}
          url = {doc.url}
        />
      ))}
    </div>
  )
}