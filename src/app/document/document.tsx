"use client";
// app/document/page.tsx
import { useEffect, useState, useCallback } from "react";
import { searchDocuments, searchProfiles } from "@/app/elastic_action";
import { useArticleSearch, useProfileSearch } from "@/app/stores";
import { ProfileSearchResult, GroupedDocument } from "@/app/elastic_action";

import { debounce } from "lodash";

export default function Document() {
  const [groupedDocuments, setGroupedDocuments] = useState<GroupedDocument[]>(
    [],
  );
  const [profiles, setProfiles] = useState<ProfileSearchResult[]>([]);
  const [description, setDescription] = useState(
    "Start entering your search query...",
  );
  const { articleSearch, setArticleSearch } = useArticleSearch();
  const { profileSearch, setProfileSearch } = useProfileSearch();

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 200), [
    articleSearch,
    profileSearch,
  ]);

  useEffect(() => {
    debouncedHandleSearch();
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [articleSearch, profileSearch, debouncedHandleSearch]);

  function handleSearch() {
    if (
      Object.values(articleSearch).every((value) => !value) &&
      Object.values(profileSearch).every((value) => !value)
    ) {
      setGroupedDocuments([]);
      setProfiles([]);
      setDescription("Start entering your search query...");
    } else if (Object.values(articleSearch).every((value) => !value)) {
      setGroupedDocuments([]);
      searchProfiles(
        profileSearch.name ?? undefined,
        profileSearch.country ?? undefined,
        profileSearch.gender ?? undefined,
        profileSearch.startDate ?? undefined,
        profileSearch.endDate ?? undefined,
      ).then((profiles: ProfileSearchResult[]) => {
        if (profiles.length === 0) {
          setProfiles(profiles);
          setDescription("No profiles found.");
        } else {
          setProfiles(profiles);
          setDescription(`Showing ${profiles.length} profile(s)`);
        }
      });
    } else if (Object.values(profileSearch).every((value) => !value)) {
      setProfiles([]);
      searchDocuments(
        articleSearch.content ?? undefined,
        articleSearch.title ?? undefined,
        articleSearch.startDate ?? undefined,
        articleSearch.endDate ?? undefined,
        articleSearch.country ?? undefined,
      )
        .then((groupedDocuments: GroupedDocument[]) => {
          if (groupedDocuments.length === 0) {
            setGroupedDocuments(groupedDocuments);
            setDescription("No documents found.");
          } else {
            setGroupedDocuments(groupedDocuments);
            setDescription(`Showing ${groupedDocuments.length} document(s)`);
          }
        })
        .catch((error: Error) => {
          console.error("Error searching documents:", error);
        });
    }
  }

  return (
    <div className="flex h-full flex-col">
      <h2>{description}</h2>
      <div className="flex-grow overflow-y-auto">
        {groupedDocuments.map((doc, index) => (
          <div key={index} className="mb-4 rounded-md bg-white p-4 shadow-md">
            <div>
              <div
                className="text-xl font-bold"
                dangerouslySetInnerHTML={{
                  __html: doc.highlight_title ?? doc.title,
                }}
              ></div>
            </div>
            {doc.date && (
              <p className="mb-2 mt-0 text-lg ">Date: {`${doc.date}`}</p>
            )}
            {doc.country && (
              <p className="mb-2 mt-0 text-lg ">Country: {doc.country}</p>
            )}
            {doc.multiple_chunks.map((chunk, chunkIndex) => (
              <pre
                key={chunkIndex}
                id={chunkIndex.toString()}
                className="text-md mt-2 overflow-hidden text-ellipsis whitespace-pre-wrap rounded-md bg-secondary p-2 font-inter shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: doc.multiple_highlight_chunks[chunkIndex] ?? chunk,
                }}
              ></pre>
            ))}
            <a
              href={`${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              🔗 {`${doc.url}`}
            </a>
          </div>
        ))}
        {profiles.map((profile, index) => (
          <div
            key={index}
            className="mb-4 flex rounded-md bg-white p-4 shadow-md"
          >
            {/* {profile.image && (
                <div className="w-1/4">
                <img src={profile.image} alt={`Profile of ${profile.name}`} className="rounded-md"
                width={300}/>
                
              </div>
            )} */}
            <div className="pl-4">
              <div className="text-xl font-bold">{profile.name}</div>
              {profile.alternateNames && (
                <p className="mb-2 mt-0 text-lg ">
                  Alternate Names: {`${profile.alternateNames}`}
                </p>
              )}
              {profile.gender && (
                <p className="mb-2 mt-0 text-lg ">
                  Gender: {`${profile.gender}`}
                </p>
              )}
              {profile.email && (
                <p className="mb-2 mt-0 text-lg ">
                  Email: {`${profile.email}`}
                </p>
              )}
              {profile.birthDate && (
                <p className="mb-2 mt-0 text-lg ">
                  Birth Date: {`${profile.birthDate}`}
                </p>
              )}
              {profile.deathDate && (
                <p className="mb-2 mt-0 text-lg ">
                  Death Date: {`${profile.deathDate}`}
                </p>
              )}
              {profile.description && (
                <p className="mb-2 mt-0 text-lg ">
                  Description: {`${profile.description}`}
                </p>
              )}
              {profile.countryCitizenship && (
                <p className="mb-2 mt-0 text-lg ">
                  Country: {`${profile.countryCitizenship}`}
                </p>
              )}
              {profile.nationality && (
                <p className="mb-2 mt-0 text-lg ">
                  Nationality: {`${profile.nationality}`}
                </p>
              )}
              {profile.numberChildren && (
                <p className="mb-2 mt-0 text-lg ">
                  Number of Children: {`${profile.numberChildren}`}
                </p>
              )}
              {profile.residence && (
                <p className="mb-2 mt-0 text-lg ">
                  Residence: {`${profile.residence}`}
                </p>
              )}
              {profile.politicalParty && (
                <p className="mb-2 mt-0 text-lg ">
                  Political Party: {`${profile.politicalParty}`}
                </p>
              )}
              {profile.occupation && (
                <p className="mb-2 mt-0 text-lg ">
                  Occupation: {`${profile.occupation}`}
                </p>
              )}
              {profile.educatedAt && (
                <p className="mb-2 mt-0 text-lg ">
                  Education: {`${profile.educatedAt}`}
                </p>
              )}
              {profile.religionWorldview && (
                <p className="mb-2 mt-0 text-lg ">
                  Religion: {`${profile.religionWorldview}`}
                </p>
              )}
              {profile.positionsHeld && (
                <p className="mb-2 mt-0 text-lg ">Positions Held:</p>
              )}
              {profile.positionsHeld &&
                profile.positionsHeld.map((position, index) => (
                  <div
                    key={index}
                    className="text-md mt-2 overflow-hidden text-ellipsis whitespace-pre-wrap rounded-md bg-secondary p-2 font-inter shadow-lg"
                  >
                    {position.position && (
                      <p className="m-0">Position: {position.position}</p>
                    )}
                    {position.startDate && (
                      <p className="m-0">Start Date: {position.startDate}</p>
                    )}
                    {position.endDate && (
                      <p className="m-0">End Date: {position.endDate}</p>
                    )}
                    {position.replaces && (
                      <p className="m-0">Replaces: {position.replaces}</p>
                    )}
                    {position.replacedBy && (
                      <p className="m-0">Replaced By: {position.replacedBy}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
