import Document from "./document";

interface Props {
  searchParams: {
    content?: string;
    title?: string;
    country?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function IndexPage({ searchParams }: Props) {
  // Filter out undefined values

  return (
    <Document
      content={searchParams.content}
      title={searchParams.title}
      country={searchParams.country}
      startDate={searchParams.startDate}
      endDate={searchParams.endDate}
    />
  );
}
