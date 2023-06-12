
// Interface para a estrutura dos seus prompts
export interface Prompt {
    interacao: string;
    prompt: string;
  }
  
  // Tipo para o objeto 'prompts'
  export type Prompts = {
    [key: string]: Prompt;
  };

  export interface OpenAIRequest {
    prompt: string;
    max_tokens: number;
    temperature: number;
    model?: string | null;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
  }

export interface Feedback {
    question: string;
    answer: string;
    rating: number;
}