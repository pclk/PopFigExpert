"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import Suggestions from "./suggestions";
import type { GroupedDocument } from "@/app/document/document";


interface ReportSummaryProps {
  articles: GroupedDocument[];
  args: {
    content?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    country?: string;
  };
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ articles, args }) => {
  const [enlargedArticles, setEnlargedArticles] = useState<number[]>([]);
  const { content, title, startDate, endDate, country } = args;

  const toggleArticle = (index: number) => {
    if (enlargedArticles.includes(index)) {
      setEnlargedArticles(enlargedArticles.filter((i) => i !== index));
    } else {
      setEnlargedArticles([...enlargedArticles, index]);
    }
  };

  // Generate suggestions based on article titles
  const suggestions = articles.reduce(
    (acc, article, index) => {
      acc[`Summarize ${article.title.substring(0, 10)}..`] =
        `Could you summarize the article titled "${article.title}", in your own words, without using the generate news articles function??`;
      return acc;
    },
    {} as { [key: string]: string },
  );

  return (
    <div className="space-y-4">
      <Card className="bg-secondary text-darkprim shadow-lg">
        <CardHeader className="">
          <CardTitle className="my-0">Great news!</CardTitle>
          <CardDescription>
            I found the top {articles.length} relevant articles for you
            {args &&
              `, based on the following query: "${[
                title && `Title: ${title}`,
                content && `Content: ${content}`,
                startDate &&
                  endDate &&
                  `Date Range: ${startDate} to ${endDate}`,
                startDate && !endDate && `Start Date: ${startDate}`,
                !startDate && endDate && `End Date: ${endDate}`,
                country && `Country: ${country}`,
              ]
                .filter(Boolean)
                .join(", ")}"`}
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="flex overflow-y-auto rounded-md">
        {articles.map((article, index) => {
    const isEnlarged = enlargedArticles.includes(index);
    const flexBasis = isEnlarged ? '100%' : `${100 / articles.length}%`;

    return (
      <div
        key={index}
        className={`mb-2 h-96 cursor-pointer rounded-lg p-2 transition-all duration-500 ease-in-out hover:text-primary ${
          isEnlarged ? 'h-auto' : ''
        }`}
        style={{ flexBasis }}
        onClick={() => toggleArticle(index)}
      >
              <h3
                className="mt-0"
                dangerouslySetInnerHTML={{
                  __html: article.highlight_title ?? article.title,
                }}
              ></h3>
              <div className="text-muted-foreground text-sm">
                {article.date && <span>({article.date})</span>}
                {article.country && <span> - {article.country}</span>}
              </div>
              {article.multiple_chunks.map((chunk, index) => (
                <pre
                  key={index}
                  className="mt-2 overflow-hidden text-ellipsis whitespace-pre-wrap rounded-md bg-secondary p-2 font-inter text-sm shadow-lg"
                  dangerouslySetInnerHTML={{
                    __html: article.multiple_highlight_chunks[index] ?? chunk,
                  }}
                ></pre>
              ))}
            </div>
          )})}
        </CardContent>
      </Card>
      <Suggestions suggestions={suggestions} />
    </div>
  );
};

export default ReportSummary;
