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

interface Article {
  title: string;
  date?: string;
  country?: string;
  content?: string;
  highlight_title?: string;
  highlight_content?: string;
}

interface ReportSummaryProps {
  articles: Article[];
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
      acc[`Summarize article ${index + 1}`] =
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
            I found the top {articles.length} relevant articles for you, based
            on the following query: "Title: {title}, Content: {content}, Start
            Date: {startDate}, End Date: {endDate}, Country: {country}".
          </CardDescription>
        </CardHeader>
        <CardContent className="flex overflow-y-auto rounded-md">
          {articles.map((article, index) => (
            <div
              key={index}
              className={`mr-2 h-96 basis-1/4 cursor-pointer rounded-lg transition-all duration-500 ease-in-out hover:text-primary ${
                enlargedArticles.includes(index) ? "h-auto basis-2/3" : ""
              }`}
              onClick={() => toggleArticle(index)}
            >
              <h3 className="mt-0">
                {article.highlight_title ?? article.title}
              </h3>
              <div className="text-muted-foreground text-sm">
                {article.date && <span>({article.date})</span>}
                {article.country && <span> - {article.country}</span>}
              </div>
              {article.content && (
                <>
                  <p className="mt-2 ">
                    {article.highlight_content ?? article.content}
                  </p>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      <Suggestions suggestions={suggestions} />
    </div>
  );
};

export default ReportSummary;
