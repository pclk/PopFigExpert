"use client";
import React, {useState} from "react";
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
}

interface ReportSummaryProps {
  articles: Article[];
}



const ReportSummary: React.FC<ReportSummaryProps> = ({ articles }) => {
  const [skinnedArticles, setSkinnedArticles] = useState<number[]>([]);

  const toggleArticle = (index: number) => {
    if (skinnedArticles.includes(index)) {
      setSkinnedArticles(skinnedArticles.filter((i) => i !== index));
    } else {
      setSkinnedArticles([...skinnedArticles, index]);
    }
  };

    // Generate suggestions based on article titles
    const suggestions = articles.reduce((acc, article, index) => {
      acc[`Explain article ${index+1}`] = `Could you explain the article titled "${article.title}"?`;
      return acc;
    }, {} as { [key: string]: string });

  return (
    <>
    <Card className="shadow-lg bg-secondary text-darkprim">
      <CardHeader className="">
        <CardTitle className="my-0">Great news!</CardTitle>
        <CardDescription>
          I found {articles.length} articles for you:
        </CardDescription>
      </CardHeader>
      <CardContent className="flex rounded-md overflow-y-auto">
        {articles.map((article, index) => (
          <div
            key={index}
            className={`cursor-pointer h-96 hover:text-primary basis-1/4 mr-2 rounded-lg transition-all ease-in-out duration-500 ${
              skinnedArticles.includes(index) ? "basis-2/3 h-auto" : ""
            }`}
            onClick={() => toggleArticle(index)}
          >
            <h3 className="mt-0">{article.title}</h3>
            <div className="text-muted-foreground text-sm">
              {article.date && <span>({article.date})</span>}
              {article.country && <span> - {article.country}</span>}
            </div>
            {article.content && (
              <>
                <p className="mt-2 ">{article.content}</p>
              </>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
    <Suggestions suggestions={suggestions} />
    </>
  );
};

export default ReportSummary;
