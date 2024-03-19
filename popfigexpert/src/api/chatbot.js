// Import the required libraries and modules
import axios from 'axios';
import OpenAI from 'openai';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL;
const ELASTICSEARCH_USER = import.meta.env.VITE_ELASTICSEARCH_USER;
const ELASTICSEARCH_PASSWORD = import.meta.env.VITE_ELASTICSEARCH_PASSWORD;

// Configure logging
const logger = console;

const openai = new OpenAI();

class ElasticsearchClient {
  constructor() {
    // Initialize the Axios instance for Elasticsearch
    this.client = axios.create({
      baseURL: process.env.VITE_ELASTICSEARCH_URL,
      auth: {
        username: process.env.VITE_ELASTICSEARCH_USER,
        password: process.env.VITE_ELASTICSEARCH_PASSWORD,
      },
    });
  }

  async search(query, dateFrom) {
    try {
      const boolQuery = { must: [], filter: [] };
      if (dateFrom) {
        boolQuery.filter.push({ range: { date: { gte: dateFrom } } });
      }
      if (query) {
        boolQuery.must.push({ match: { content: query } });
      }
      const searchBody = boolQuery.must.length > 0 || boolQuery.filter.length > 0
        ? { size: 4, query: { bool: boolQuery } }
        : { query: { match_all: {} } };

      const response = await this.client.post('/mfa-press/_search', searchBody);
      const hits = response.data.hits.hits;
      const prettyResult = `Total documents found: ${response.data.hits.total.value}\n${hits
        .map(
          (hit, i) => `Document ${i + 1}:
  Title: ${hit._source.title || 'N/A'}
  Date: ${hit._source.date || 'N/A'}
  URL: ${hit._source.url || 'N/A'}
  Country: ${hit._source.country || 'N/A'}
  Content: ${hit._source.content || 'N/A'}\n`,
        )
        .join('\n')}`;
      return [hits.map((hit) => hit._source), prettyResult];
    } catch (error) {
      logger.error(`Error in search: ${error}`);
      throw error;
    }
  }

  // Implement other search methods (searchByKeyword, searchByDateRange, searchWithPhraseMatching) similarly
}

class OpenAIClient {
  constructor() {
    // Initialize the OpenAI client instance
    this.openai = axios.create({
      baseURL: 'https://api.openai.com',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });
    this.esClient = new ElasticsearchClient();
  }

  async createAssistant(systemMessage) {
    try {
      const response = await this.openai.post('/v1/assistants', {
        name: 'Elasticsearch Assistant',
        instructions: systemMessage,
        model: 'gpt-3.5-turbo',
        tools: [
          {
            type: 'function',
            function: {
              name: 'search',
              description:
                'Search for political documents in Elasticsearch. Use this when users asks about any general political topic to supplement your response.',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query to insert into Elasticsearch.',
                  },
                },
                required: ['query'],
              },
            },
          },
        ],
      });
      const assistant = response.data;
      console.log(`Assistant created with ID: ${assistant.id}`);
      return assistant;
    } catch (error) {
      logger.error(`Error in createAssistant: ${error}`);
      throw error;
    }
  }

  // Implement executeRun method similarly
}

class Chatbot {
  constructor() {
    this.esClient = new ElasticsearchClient();
    this.openaiClient = new OpenAIClient();
    this.systemMessage = process.env.CHATBOT_TEMPLATE;
    this.reportFunctionTemplate = process.env.REPORT_FUNCTION_TEMPLATE;
    this.personalityFunctionTemplate = process.env.PERSONALITY_FUNCTION_TEMPLATE;
    this.assistant = null;
    this.thread = null;
  }

  async init() {
    try {
      // Check if an Elasticsearch assistant already exists
      const response = await this.openaiClient.openai.get('/v1/assistants');
      const assistants = response.data;
      for (const assistant of assistants) {
        if (assistant.name === 'Elasticsearch Assistant') {
          this.assistant = assistant;
          break;
        }
      }

      if (!this.assistant) {
        this.assistant = await this.openaiClient.createAssistant(this.systemMessage);
      }

      const threadResponse = await this.openaiClient.openai.post('/v1/threads');
      this.thread = threadResponse.data;
      console.log(`Created thread with ID: ${this.thread.id}`);
    } catch (error) {
      logger.error(`Error in init: ${error}`);
      throw error;
    }
  }

  async run() {
    try {
      await this.init();
      console.log("Welcome to the chatbot! Type 'quit' or 'exit' to end the conversation.");
      while (true) {
        const userInput = prompt('User: ').trim();
        if (userInput.toLowerCase() === 'quit' || userInput.toLowerCase() === 'exit') {
          break;
        }
        console.log(`User input: ${userInput}`);
        const response = await this.openaiClient.executeRun(this.thread.id, this.assistant.id, userInput);
        console.log(`Assistant: ${response}`);
      }
    } catch (error) {
      logger.error(`Error in run: ${error}`);
      throw error;
    }
  }
}

export { Chatbot };