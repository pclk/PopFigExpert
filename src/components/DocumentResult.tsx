// DocumentResult.tsx
import React from "react";
import { Box, Text } from "@mantine/core";

interface DocumentResultProps {
  title: string;
  date: string;
  country: string;
  content: string;
}

export default function DocumentResult({ title, date, country, content }: DocumentResultProps) {
  return (
    <Box className="bg-white p-4 rounded-md shadow-md mb-4">
      <Text size="lg" className="mb-2">
        {title}
      </Text>
      <Text size="sm" className="mb-1">
        Date: {date}
      </Text>
      <Text size="sm" className="mb-2">
        Country: {country}
      </Text>
      <Text size="sm">{content}</Text>
    </Box>
  );
}