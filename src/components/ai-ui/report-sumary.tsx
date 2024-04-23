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

const suggestions = {
  "Explain Article 1": "Could you explain the first article?",
  "Explain Article 2": "Could you explain the second article?",
  "Explain Article 3": "Could you explain the third article?",
  "Explain Article 4": "Could you explain the fourth article?",
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

  return (
    <>
    <Card className="shadow-lg bg-secondary text-darkprim">
      <CardHeader className="">
        <CardTitle className="my-0">Great news!</CardTitle>
        <CardDescription>
          I found {articles.length} articles for you:
        </CardDescription>
      </CardHeader>
      <CardContent className="flex rounded-md">
        {articles.map((article, index) => (
          <div
            key={index}
            className={`cursor-pointer h-96 overflow-y-clip hover:text-accent basis-1/4 mr-2 rounded-lg transition-all ease-in-out duration-500 ${
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
