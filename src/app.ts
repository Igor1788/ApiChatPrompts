// server.ts
import express from 'express';
import axios, { AxiosError } from 'axios';
import { config } from 'dotenv';
import { Request, Response } from 'express';
import { prompts, chunkText, OpenAIRequest, Feedback, queryOpenAI } from './util'

config();

const app = express();
app.use(express.json());

app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, promptKey } = req.body;
  const prompt = prompts[promptKey];

  if (!prompt) {
    return res.status(400).json({ error: 'Invalid promptKey' });
  }

  let fullPrompt = `${prompt.prompt}\n${message}`;
  
  // Calculate tokens based on prompt length
  let max_tokens = fullPrompt.length > 200 ? 400 : 60;

  // Specify the model only for the playground environment
  const model = process.env.ENVIRONMENT === 'playground' ? "text-davinci-003" : null;

  const data: OpenAIRequest = {
    model: model,
    prompt: "",
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };


  try {
    const response = await queryOpenAI(data, model);

    // res.json(response.data.choices[0].text.trim());
    const chunks = chunkText(fullPrompt, 250);

    let responseText = '';

    for (let chunk of chunks) {
      data.prompt = chunk;

      responseText += response.data.choices[0].text.trim().replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }
    responseText = responseText.length > 150 ? responseText.slice(0, 150) : responseText;
    res.json(responseText);
  } catch (error) {
    const err = error as AxiosError;
    console.error(err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Erro na consulta do Chat GPT 3' });
  }
});

app.post('/api/feedback', async (req: Request, res: Response) => {
    const feedback: Feedback = req.body; 
    console.log(feedback);
    res.json({ message: 'Feedback recebido. Obrigado!' });
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
