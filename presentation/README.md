# ToC

this is the agenda for today...

- Background
- Project scope
- Scrape
- Experimentaion
- Web App
- Demo

# Background

I am from NYP Applied AI analytics. I have always been dealing with jupyter notebooks, one time I used flask but this time I'm trying out Next.Js

# Project scope & deliverables

Build a web app powered by Mistral to search and discover prominent profiles and MFA press statements.

# Scraping

## MFA press

Scraping: Python BeautifulSoup Requests Everypolitician WikidataAPI

## Everypolitician

Scraping: Python Requests Everypolitician WikidataAPI

## Challenges

# LLM experimentation

Llama 2, GPT-4, Gemini, Mistral

settled on mistral cuz why

# Web app Tech stack

Front-end: NextJS Tailwind

Back-end: NextJS Elasticsearch Mistral

Back-end Tools: Docker ngrok

# Demo

## Scenario 1: Lee Hsien Loong Profile

Goal: Discover Lee Hsien Loong
Functions used: Profile Search, Prompt template, Chat with Eve
Steps:

1. Chat with Eve Article: "ASEAN diplomatic relations"
2. Chat with Eve Profile: "Lee Hsien Loong"
3.

<!-- 1. User inputs "Lee Hsien Loong" in Profile Search
2. System retrieves information and displays it in cards
3. User goes home, selects the Profile template, adjusts and send the message.
4. System routes to Chat with Eve and answers
5. User selects Summarize Lee Hsien Loong and reads the answer.
6. End -->

## Scenario 2: ASEAN diplomatic relations Article

Goal: Obtain a concise overview of ASEAN diplomatic relations from MFA press statements.
Functions used: Document Search, Summarization
Steps:

1. User inputs the search term "ASEAN diplomatic relations" and sets the date range from January 2021 to December 2021.
2.
3. System retrieves all relevant MFA press statements within the specified date range.
4. User utilizes the summarization function to condense the main points of these documents.
5. System provides the user with a concise overview of the year's diplomatic activities.
6. End

## Scenario 3: ???

In this scenario, the user interacts with Eve, a GenAI chatbot, to obtain information on "climate change policies" by prominent figures and in MFA press statements. The user starts by asking Eve to generate search queries based on the topic. Eve processes this request and retrieves relevant documents. Following this, the user requests Eve to summarize the key points from these documents. Eve uses her advanced reasoning capabilities to provide summaries that are not only accurate but also contextually relevant, highlighting the impact of these policies.

# Challenges & Solution

problems deciding with front end framework (nextjs vs react)
problems deciding Component libraries (mantine) vs tailwind css
problems deciding with backend (routers vs server actions)
problems with poor documentation of GenAI tools

# Improvements

- [ ] Set templates
- [ ] Integrate Clerk for user authentication and authorization
- [ ] Ability to select documents from searches, and bring them into the chat intuitively.
- [ ] Ability to search documents through an @mention in the chat, and bring it into the chat.
- [ ] ChatHistory with DB integration

# Learnings and Takeaways

Productivity significantly increases when working under a deadline.
Artificial Intelligence becomes substantially less effective without software engineering skills.
Utilizing a reverse proxy is beneficial for cloud development.
Acquired knowledge on configuring SSL certificates.
Gained exposure to various Large Language Models and understood their distinct capabilities.

Discovered the value of user feedback in refining AI functionalities and interfaces.
