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
import type { ProfileSearchResult } from "@/app/elastic_action";


interface ReportSummaryProps {
  profiles: ProfileSearchResult[];
  args: {
    name?: string;
    country?: string;
    gender?: string;
    startDate?: string;
    endDate?: string;
  };
}

export default function ProfileSummary({ profiles, args }: ReportSummaryProps) {
  const [enlargedArticles, setEnlargedArticles] = useState<number[]>([]);
  const { name, country, gender, startDate, endDate } = args;

  const toggleArticle = (index: number) => {
    if (enlargedArticles.includes(index)) {
      setEnlargedArticles(enlargedArticles.filter((i) => i !== index));
    } else {
      setEnlargedArticles([...enlargedArticles, index]);
    }
  };

  // Generate suggestions based on article titles
  const suggestions = profiles.reduce(
    (acc, profile, index) => {
      acc[`Summarize ${profile.name}`] =
        `Could you summarize the profile titled "${profile.name}" in your own words, and ONLY "${profile.name}", disregarding the previous search terms, without using the generate profiles function? Do note that the function has already ran, and you can proceed summarizing as the next step.`;
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
            I found the top {profiles.length} relevant profiles for you
            {args &&
              `, based on the following query: "${[
                name && `Name: ${name}`,
                gender && `Gender: ${gender}`,
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
        {profiles.map((profile, index) => {
    const isEnlarged = enlargedArticles.includes(index);
    const flexBasis = isEnlarged ? '100%' : `${100 / profiles.length}%`;

    return (
      <div
        key={index}
        className={`mb-2 h-96 cursor-pointer rounded-lg m-1 p-1 transition-all duration-500 ease-in-out hover:text-primary ${
          isEnlarged ? 'h-auto' : ''
        }`}
        style={{ flexBasis }}
        onClick={() => toggleArticle(index)}
      >
            <div className="text-xl font-bold">{profile.name}</div>
              {profile.alternateNames && <p className="mb-2 mt-0 text-lg ">Alternate Names: {`${profile.alternateNames}`}</p>}
              {profile.gender && <p className="mb-2 mt-0 text-lg ">Gender: {`${profile.gender}`}</p>}
              {profile.email && <p className="mb-2 mt-0 text-lg ">Email: {`${profile.email}`}</p>}
              {profile.birthDate && <p className="mb-2 mt-0 text-lg ">Birth Date: {`${profile.birthDate}`}</p>}
              {profile.deathDate && <p className="mb-2 mt-0 text-lg ">Death Date: {`${profile.deathDate}`}</p>}
              {profile.description && <p className="mb-2 mt-0 text-lg ">Description: {`${profile.description}`}</p>}
              {profile.countryCitizenship && <p className="mb-2 mt-0 text-lg ">Country: {`${profile.countryCitizenship}`}</p>}
              {profile.nationality && <p className="mb-2 mt-0 text-lg ">Nationality: {`${profile.nationality}`}</p>}
              {profile.numberChildren && <p className="mb-2 mt-0 text-lg ">Number of Children: {`${profile.numberChildren}`}</p>}
              {profile.residence && <p className="mb-2 mt-0 text-lg ">Residence: {`${profile.residence}`}</p>}
              {profile.politicalParty && <p className="mb-2 mt-0 text-lg ">Political Party: {`${profile.politicalParty}`}</p>}
              {profile.occupation && <p className="mb-2 mt-0 text-lg ">Occupation: {`${profile.occupation}`}</p>}
              {profile.educatedAt && <p className="mb-2 mt-0 text-lg ">Education: {`${profile.educatedAt}`}</p>}
              {profile.religionWorldview && <p className="mb-2 mt-0 text-lg ">Religion: {`${profile.religionWorldview}`}</p>}
              {profile.positionsHeld && <p className="mb-2 mt-0 text-lg ">Positions Held:</p>}
              {profile.positionsHeld && profile.positionsHeld.map((position, index) => (
                <div key={index} className="text-md mt-2 overflow-hidden text-ellipsis whitespace-pre-wrap rounded-md bg-secondary p-2 font-inter shadow-lg"                >
                  {position.position && <p className="m-0">Position: {position.position}</p>}
                  {position.startDate && <p className="m-0">Start Date: {position.startDate}</p>}
                  {position.endDate && <p className="m-0">End Date: {position.endDate}</p>}
                  {position.replaces && <p className="m-0">Replaces: {position.replaces}</p>}
                  {position.replacedBy && <p className="m-0">Replaced By: {position.replacedBy}</p>}
                </div>
              ))}
            </div>
          )})}
        </CardContent>
      </Card>
      <Suggestions suggestions={suggestions} />
    </div>
  );
};