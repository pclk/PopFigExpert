# PopFigExpert - Document AI Companion powered with GenUI

| ![Homepage Interface](READMEmedia/home.gif) | <div align="center"><span style="font-size: large;">**Discover the homepage.<br>Engage with an intuitive chat interface.<br>Experience seamless AI interactions.**</span></div> |
| --- | --- |
| ![Article Summaries](READMEmedia/eve_article.gif) | <div align="center"><span style="font-size: large;">**Request AI-driven summaries.<br>Receive concise reports.<br>Analyze key documents effectively.**</span></div> |
| ![Personality Summaries](READMEmedia/eve_profile.gif) | <div align="center"><span style="font-size: large;">**Access detailed personality insights.<br>Utilize extensive data synthesis.<br>Explore profiles of prominent figures.**</span></div> |
| ![Document Search](READMEmedia/search.gif) | <div align="center"><span style="font-size: large;">**Search documents with advanced filters.<br>Locate articles by date, title, and more.<br>Supports detailed profile searches.**</span></div> |

PopFigExpert is an AI-powered information assistant designed to provide accurate and comprehensive information about popular figures, historical events, and current affairs. Built using Next.js, React, and Tailwind CSS, this application leverages the power of OpenAI's GPT-3.5 Turbo and Anthropic's Mixtral 7x8b models to deliver a seamless and interactive user experience.

Special mention to Centre of Strategic Infocomms Technology (CSIT), for assigning this amazing project to me! 
Thank you Yai Hui, for guiding and assisting me from things to model selection, payment of AI credits, and allowing me to work with Next.js!
## TODO

- [x] Scrape and ingest MFA-Press Statements into Elasticsearch
- [x] Scrape and ingest Wikipedia articles into Elasticsearch
- [x] Basic chatbot functionality with OpenAI API and Mixtral model support
- [x] Set up Vercel AI SDK 
- [x] UI for interacting with the chatbot
- [x] Function calling capabilities with OpenAI
- [x] Function calling capabilities with Mixtral
- [x] UI for interacting with Elasticsearch
  - [x] Search Input, Sorting and Filters
  - [x] Implement date handling functionality
  - [x] Search for documents on key press
  - [x] Include reset button to clear all filters and search results
- [x] Integrate model's Function calling with Elasticsearch:
  - [x] Implement chatbot's ability to generate Elasticsearch queries based on user input
  - [x] Process and present Elasticsearch results to the user within the chat interface
  - [x] UI for displaying and sending inputs within the genUI. 
- [ ] Deploy on Vercel

- [] Wikipedia:
  - [] build genUi for image + personality summary
**- [x] classify chunks underneath the same title, like the manual document search. return doc.title.length for article length.**
**- [x] prompt template in page.tsx and navigation**
 


Extras:
- [ ] Integrate Clerk for user authentication and authorization

## Features

- **AI-Powered Chatbot**: Engage in natural language conversations with Eve, an AI assistant trained to provide information from a curated document database.
- **Customizable AI Models**: Choose between OpenAI's GPT-3.5 Turbo and Anthropic's Mixtral 7x8b models to power the chatbot's responses.
- **Document Search**: Perform manual searches on the document database using filters such as content, date, title, and country.
- **Report Summarization**: Request report summaries on specific topics, and the AI assistant will synthesize information from relevant documents to provide concise summaries.
- **Personality Summaries**: Obtain "Wikipedia-style" summaries about notable individuals based on information from the document database.
- **Citation Integration**: The AI assistant incorporates citations using Markdown linking, embedding the source URLs within the summarized information for transparency and credibility.
- **Chat History**: Easily navigate through previous chat conversations and continue where you left off.
- **Responsive Design**: The application is designed to be responsive and accessible across various devices and screen sizes.

## Architecture

The application follows a client-server architecture, with the frontend built using Next.js and React, and the backend powered by Next.js API routes. The key components of the architecture include:

| **[Next.js](https://nextjs.org/)** | **[React](https://reactjs.org/)** | **[Tailwind CSS](https://tailwindcss.com/)** | **[OpenAI](https://www.openai.com/)** | **[Mixtral](https://mistral.ai/)** | **[Elasticsearch](https://www.elastic.co/elasticsearch/)** | **[Zod](https://github.com/colinhacks/zod)** |
| --- | --- | --- | --- | --- | --- | --- |
| Next.js: A React framework that enables server-side rendering, routing, and API route handling. | React: A JavaScript library for building user interfaces. | Tailwind CSS: A utility-first CSS framework for rapidly building custom user interfaces. | OpenAI GPT-3.5 Turbo: An AI model from OpenAI used for generating chatbot responses and summaries. | Mixtral 7x8b: An open source Mixture of Experts model, suitable to run on premises, providing privacy who appreciate it, like CSIT. | Elasticsearch: A distributed search and analytics engine used for storing and querying the document database. | Zod: A TypeScript-first schema validation library used for validating user input and API responses. | |


## Folder Structure

The project follows a standard Next.js folder structure, with additional directories for components, context, and utility functions:

- `app`: Contains the main application components and pages.
  - `api`: Defines the API routes for handling requests to the AI models and Elasticsearch.
  - `chat`: Implements the chat functionality, including chat history and message display.
  - `document`: Handles the document search functionality.
- `components`: Contains reusable React components used throughout the application.
  - `ai-ui`: Implements the user interface components specific to the AI interactions.
  - `home`: Defines the components used on the home page, such as the model dropdown and tab selector.
  - `ui`: Contains generic UI components, such as buttons, cards, and input fields.
- `context`: Manages the application state using React Context API.
- `lib`: Contains utility functions and type definitions.
  - `utils`: Provides helper functions for interacting with the AI models and Elasticsearch.
  - `validators`: Defines data validation schemas using Zod.

## Getting Started

To run the PopFigExpert application locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/PopFigExpert.git
   ```

2. Install the dependencies:

   ```
   cd PopFigExpert
   npm install
   ```

3. Set up the required environment variables:

   - Create a `.env.local` file in the root directory.
   - Add the necessary environment variables, such as API keys and Elasticsearch configuration.

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the application.

## Customiation

You can customize:
- **AI Model**: We already set up OpenAI and Mixtral, meaning you can freely add your preferred OpenAI or Mistral models. However, for other models, you would have to code it yourself.
- **User Interface**: The UI is built with Tailwind CSS and shadcn. You can modify the design from the tailwind to match your desired design aesthetics.
- **Document Database**: We use Elasticsearch as our document database. You can customize the configuration there. 

## Troubleshooting
If you encounter any issues,
- **Environment Variables**: Ensure that you have properly set up the required environment variables, such as API keys and Elasticsearch configuration, in the .env.local file or your deployment environment.
- **API Errors**: If you experience errors related to the AI models or Elasticsearch, double-check that your API keys and endpoints are correct and that you have sufficient permissions to access the respective services.
- **Dependency Issues**: If you face issues with dependencies, try running npm install again to ensure that all the required packages are properly installed. If the issue persists, you can try deleting the node_modules folder and reinstalling the dependencies.
- **Browser Compatibility**: PopFigExpert is designed to be compatible with modern web browsers and was tested in a chromium browser. If you encounter any rendering or functionality issues, make sure you are using an up-to-date version of a supported browser.

## Contact

If you have any questions, suggestions, or feedback regarding PopFigExpert, please feel free to reach out me at [weiheng@proco.link](mailto:weiheng@proco.link).

Happy exploring with PopFigExpert!


maybe i should start a nextjs project on benchmarking llms on your own questions.
