// components/DocumentResult.tsx
import React from 'react'
import { Box, Text } from '@mantine/core'
import { DocumentType } from '@/lib/validators/DocumentType'

export default function DocumentResult({
  id,
  title,
  date,
  country,
  content,
  url
}: DocumentType) {

  console.log('Content in DocumentResult:', content);
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
      <pre className="text-sm " style={{fontFamily: `inherit`, textWrap: `pretty`}}>{content}</pre>
      <a href={`${url}`} target="_blank" rel="noopener noreferrer">
        🔗
      </a>
{/* implement highlighting of the search. can save in. scrape mfa again with id */}
    </Box>
  )
}