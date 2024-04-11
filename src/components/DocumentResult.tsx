// components/DocumentResult.tsx
import React from "react";
import { Box, Text } from "@mantine/core";
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
    <Box className="mb-4 rounded-md bg-white p-4 shadow-md">
      <Text size="lg" className="mb-2 font-bold">
        {title}
      </Text>
      <Text size="md" className="mb-1">
        Date: {`${date}`}
      </Text>
      <Text size="md" className="mb-2">
        Country: {country}
      </Text>
      <pre
        className="text-sm "
        style={{ fontFamily: `inherit`, textWrap: `pretty` }}
      >
        {chunk}
      </pre>
      <a href={`${url}`} target="_blank" rel="noopener noreferrer">
        🔗
      </a>
      {/* implement highlighting of the search. can save in. scrape mfa again with id */}
    </Box>
  );
}
