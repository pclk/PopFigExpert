// Import the required libraries and modules
import axios from 'axios';
import OpenAI from 'openai';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL;
const ELASTICSEARCH_USER = import.meta.env.VITE_ELASTICSEARCH_USER;
const ELASTICSEARCH_PASSWORD = import.meta.env.VITE_ELASTICSEARCH_PASSWORD;

// Configure logging
const logger = console;
logger.log('Hello from chatbot.js');

class Chatbot {
  constructor() {

  }

  async init() {
    console.log('Initializing chatbot...');
  }
  async run() {
    try {
      await this.init();
      console.log("Welcome to the chatbot! Type 'quit' or 'exit' to end the conversation.");
    } catch (error) {
      logger.error(`Error in run: ${error}`);
      throw error;
    }
}
}
export {Chatbot}