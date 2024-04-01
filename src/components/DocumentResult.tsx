// components/DocumentResult.tsx
import React from 'react'
import { Box, Text } from '@mantine/core'
import { DocumentType } from '@/lib/validators/DocumentType'
import Markdown from 'react-markdown'

export default function DocumentResult({
  id,
  title,
  date,
  country,
  content,
  url
}: DocumentType) {
  content = "# Hi\n"+ content + "\n## Bye\n"
  return (
    <Box className="bg-white p-4 rounded-md shadow-md mb-4">
      <Text size="lg" className="mb-2 font-bold">
        {title}
      </Text>
      <Text size="md" className="mb-1">
        Date: {`${date}`}
      </Text>
      <Text size="md" className="mb-2">
        Country: {country}
      </Text>
      <Markdown className="text-sm">{content}</Markdown>
      <a href={`${url}`} target="_blank" rel="noopener noreferrer">
        🔗
      </a>

    </Box>
  )
}