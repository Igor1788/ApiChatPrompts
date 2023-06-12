import axios from "axios";
import { OpenAIRequest } from './interfaces/interface';

const PRODUCTION_URL = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
const PLAYGROUND_URL = 'https://api.openai.com/v1/completions';

export async function queryOpenAI(data: OpenAIRequest, model: string | null) {
    const OPENAI_URL = process.env.ENVIRONMENT === 'production' ? PRODUCTION_URL : PLAYGROUND_URL;
    if (model) {
      data.model = model;
    }
    return axios.post(OPENAI_URL, data, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }
  