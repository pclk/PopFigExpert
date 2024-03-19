# PopFigExpert

PopFigExpert is a GenAI-powered chatbot application built as part of a CSIT internship project. It leverages Retrieval-Augmented Generation (RAG) using Elasticsearch and is developed as a single-page application (SPA) using React.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction
PopFigExpert is an intelligent chatbot designed to provide accurate and contextually relevant responses to user queries. By combining the power of GenAI and Elasticsearch, PopFigExpert can understand user intent, retrieve relevant information, and generate human-like responses in real-time.

The project aims to showcase the potential of GenAI in creating engaging and informative chatbot experiences. It demonstrates the integration of modern web development technologies like React with advanced natural language processing and information retrieval techniques.

## Features
- Natural language understanding and generation using GenAI
- Retrieval-Augmented Generation (RAG) with Elasticsearch for contextual responses
- Single-page application (SPA) architecture for seamless user experience
- Responsive and intuitive user interface
- Real-time chat functionality
- Ability to handle a wide range of user queries and provide accurate information
- Integration with external APIs for enhanced functionality
- Customizable and extensible codebase

## Technologies Used
- React: JavaScript library for building user interfaces
- Elasticsearch: Distributed search and analytics engine for fast information retrieval
- GenAI: Generative AI model for natural language understanding and generation
- Node.js: JavaScript runtime environment for server-side development
- Express.js: Web application framework for building APIs
- HTML5 & CSS3: Markup and styling for the user interface
- WebSocket: Protocol for real-time bidirectional communication
- Jest: JavaScript testing framework for unit and integration tests
- GitHub Codespaces: Cloud-based development environment for collaborative coding

## Installation
1. Clone the repository:
`git clone https://github.com/your-username/PopFigExpert.git`
2. Navigate to the project directory:
`cd PopFigExpert`
3. Install the dependencies:
`npm install`
4. Set up the required environment variables:
- Create a `.env` file in the root directory
- Define the necessary variables (e.g., API keys, database connection strings)

5. Start the development server:
`npm start`
6. Access the application in your browser at `http://localhost:3000`

## Usage
1. Open the PopFigExpert application in your web browser.
2. Type your query or message in the chat input field.
3. Press Enter or click the Send button to submit your query.
4. PopFigExpert will process your query, retrieve relevant information, and generate a response.
5. The response will be displayed in the chat interface.
6. Continue the conversation by entering further queries or messages.

## Architecture
PopFigExpert follows a client-server architecture with the following components:
- React SPA: The front-end client application built with React, responsible for rendering the user interface and handling user interactions.
- Node.js Server: The back-end server application built with Node.js and Express.js, responsible for handling API requests, communicating with Elasticsearch, and integrating with the GenAI model.
- Elasticsearch: The distributed search and analytics engine used for storing and retrieving information relevant to user queries.
- GenAI Model: The generative AI model responsible for understanding user queries and generating appropriate responses.

The client and server communicate through API endpoints and WebSocket connections for real-time updates.

## API Documentation
The PopFigExpert API documentation can be found in the [API.md](./docs/API.md) file. It provides detailed information about the available endpoints, request/response formats, and authentication requirements.

## Testing
PopFigExpert includes a comprehensive test suite to ensure the reliability and correctness of the application. The tests cover both the front-end and back-end components.

To run the tests, use the following command:
`npm test`

The test results will be displayed in the console, indicating the number of passing and failing tests.

## Deployment
To deploy PopFigExpert to a production environment, follow these steps:
1. Build the optimized production-ready files:
`npm run build`

2. Deploy the generated files to your preferred hosting platform (e.g., Netlify, Heroku, AWS).

3. Set up the necessary environment variables on the hosting platform.

4. Start the server and ensure it is accessible via the specified URL.

## Contributing
Contributions to PopFigExpert are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the tests pass.
4. Submit a pull request describing your changes.

Please adhere to the [code of conduct](./CODE_OF_CONDUCT.md) and the [contributing guidelines](./CONTRIBUTING.md) when contributing to the project.

## License
PopFigExpert is open-source software licensed under the [MIT License](./LICENSE). You are free to use, modify, and distribute the project in accordance with the terms of the license.