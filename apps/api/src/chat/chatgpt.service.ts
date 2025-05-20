import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatGptService {
  private openai: OpenAI;
  private readonly logger = new Logger(ChatGptService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async askQuestion(
    prompt: string,
    retries = 3,
    delayMs = 1000,
  ): Promise<Array<{ role: string; content: string }>> {
    let attempt = 0;

    while (attempt < retries) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4.1',
          messages: [{ role: 'user', content: prompt }],
        });

        const content =
          response.choices[0]?.message?.content ?? 'Sem resposta.';
        return [{ role: 'assistant', content }];
      } catch (error: any) {
        this.logger.error(`Erro na API OpenAI: ${error.message || error}`);
        attempt++;

        if (attempt >= retries) {
          throw error;
        }
        await this.delay(delayMs);
      }
    }

    // Fallback (não deve chegar aqui)
    return [{ role: 'assistant', content: 'Erro ao processar a solicitação.' }];
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
