"use server";

export type GroupedDocument = {
  title: string;
  highlight_title: string;
  date: string;
  country: string;
  url: string;
  multiple_chunks: string[];
  multiple_highlight_chunks: string[];
};

type ArticleSearchResult = {
  title: string;
  url: string;
  date: string;
  country: string;
  content: string;
}

export type ProfileSearchResult = {
  name?: string;
  alternateNames?: string[];
  gender?: string;
  email?: string;
  birthDate?: string;
  deathDate?: string;
  placeBirth?: string;
  countryCitizenship?: string;
  nationality?: string;
  religionWorldview?: string;
  numberChildren?: number;
  residence?: string;
  politicalParty?: string;
  occupation?: string;
  educatedAt?: string;
  image?: string;
  description?: string;
  positionsHeld?: [
    {
      position?: string;
      startDate?: string;
      endDate?: string;
      replaces?: string;
      replacedBy?: string;
    },
  ];
};
export async function searchDocuments(
  content?: string,
  title?: string,
  startDate?: string,
  endDate?: string,
  country?: string,
  top_k?: number,
) {
  if (!content && !title && !startDate && !endDate && !country) {
    return [];
  }
  try {
    const requestBody = {
      from: 0,
      size: top_k ? top_k : 5,
      query: {
        bool: {
          must: [
            ...(country ? [{ match: { country: country } }] : []),
            ...(content ? [{ match: { content: content } }] : []),
            ...(title ? [{ match: { title: title } }] : []),
          ],
          filter: [
            ...(startDate && endDate
              ? [{ range: { date: { gte: startDate, lte: endDate } } }]
              : []),
            ...(startDate && !endDate
              ? [{ range: { date: { gte: startDate } } }]
              : []),
            ...(!startDate && endDate
              ? [{ range: { date: { lte: endDate } } }]
              : []),
          ],
        },
      },
      highlight: {
        require_field_match: false,
        pre_tags: ["<mark class='bg-darkprim text-white'>"],
        post_tags: ["</mark>"],
        fields: {
          ...(content
            ? {
                content: {
                  highlight_query: { match: { content: content } },
                  number_of_fragments: 0,
                },
              }
            : {}),
          ...(title
            ? {
                title: {
                  highlight_query: { match: { title: title } },
                  number_of_fragments: 0,
                },
              }
            : {}),
        },
      },
    };
    // console.log("sending request body", requestBody);

    const response = await fetch(`${process.env.HOST_URL}/api/article`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    let parsedData;
    try {
      parsedData = await response.json();
    } catch (jsonParseError) {
      console.error("Failed to parse JSON response:", jsonParseError);
      throw new Error(
        "Failed to parse the response from the server. The server might be experiencing issues or the response format may have changed.",
      );
    }

    console.log("Elastic Response Status:", response.status);
    // console.log("Elastic body", parsedData)

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Search request failed with status ${response.status}: ${errorText}`,
      );
    }
    const groupedDocuments: GroupedDocument[] = [];
    const urlMap: { [url: string]: GroupedDocument } = {};
    console.log("parsedData length", parsedData.hits.hits.length);

    // Format the parsed data as seen in document.tsx
    parsedData.hits.hits.forEach((hit: any) => {
      const { title, url, date, country, content }: ArticleSearchResult =
        hit._source;
      const { title: highlight_title, content: highlight_content } =
        hit.highlight ?? {};
      if (url in urlMap) {
        urlMap[url].multiple_chunks.push(content);
        urlMap[url].multiple_highlight_chunks.push(highlight_content);
      } else {
        urlMap[url] = {
          title: title,
          highlight_title: highlight_title,
          date: date,
          url: url,
          country: country,
          multiple_chunks: [content],
          multiple_highlight_chunks: [highlight_content],
        };
      }
    });

    Object.values(urlMap).forEach((doc) => {
      groupedDocuments.push(doc);
    });
    // console.log('groupedDocuments in elastic_action', groupedDocuments)

    return groupedDocuments;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error(
      "An error occurred while searching documents. Please try again later.",
    );
  }
}

export async function searchProfiles(
  name?: string,
  country?: string,
  gender?: string,
  startDate?: string,
  endDate?: string,
  top_k?: number,
) {
  if (!name && !country && !gender && !startDate && !endDate) {
    return [];
  }
  try {
    const requestBody = {
      from: 0,
      size: top_k ? top_k : 5,
      query: {
        bool: {
          must: [
            ...(name ? [{ match: { name: name } }] : []),
            ...(country ? [{ match: { country: country } }] : []),
            ...(gender ? [{ match: { gender: gender } }] : []),
          ],
          filter: [
            ...(startDate && endDate
              ? [{ range: { date: { gte: startDate, lte: endDate } } }]
              : []),
            ...(startDate && !endDate
              ? [{ range: { date: { gte: startDate } } }]
              : []),
            ...(!startDate && endDate
              ? [{ range: { date: { lte: endDate } } }]
              : []),
          ],
        },
      },
    };

    const response = await fetch(`${process.env.HOST_URL}/api/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    let parsedData;
    try {
      parsedData = await response.json();
    } catch (jsonParseError) {
      console.error("Failed to parse JSON response:", jsonParseError);
      throw new Error(
        "Failed to parse the response from the server. The server might be experiencing issues or the response format may have changed.",
      );
    }

    console.log("Elastic Response Status:", response.status);
    // console.log("Elastic body", parsedData)t

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Elasticsearch request failed with status ${response.status}: ${errorText}`,
      );
    }
    console.log("parsedData length", parsedData.hits.hits.length);

    const Profiles: ProfileSearchResult[] = [];
    parsedData.hits.hits.forEach((hit: any) => {
      Profiles.push(hit._source);
    });
    // console.log('Profiles', Profiles)

    return Profiles;
  } catch (error) {
    console.error("Error searching profiles:", error);
    throw new Error(
      "An error occurred while searching profiles. Please try again later.",
    );
  }
}
