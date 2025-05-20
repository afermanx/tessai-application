import { ChatGptService } from './chatgpt.service';
import OpenAI from 'openai';

jest.mock('openai'); // mocka a biblioteca OpenAI

describe('ChatGptService', () => {
  let service: ChatGptService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // Mock da instância e do método create
    mockCreate = jest.fn();
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    service = new ChatGptService();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve retornar a resposta do assistant com sucesso', async () => {
    const prompt = 'Qual é a capital da França?';
    const mockContent = 'A capital da França é Paris.';

    mockCreate.mockResolvedValue({
      choices: [{ message: { content: mockContent } }],
    });

    const result = await service.askQuestion(prompt);

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
    });

    expect(result).toEqual([{ role: 'assistant', content: mockContent }]);
  });

  it('deve tentar novamente em caso de erro e lançar no final', async () => {
    mockCreate
      .mockRejectedValueOnce(new Error('API off'))
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockRejectedValueOnce(new Error('Falhou mesmo'));

    await expect(service.askQuestion('teste')).rejects.toThrow('Falhou mesmo');
    expect(mockCreate).toHaveBeenCalledTimes(3);
  });

  it('deve usar fallback quando não tiver resposta', async () => {
    mockCreate.mockResolvedValue({
      choices: [{}],
    });

    const result = await service.askQuestion('oi');
    expect(result).toEqual([{ role: 'assistant', content: 'Sem resposta.' }]);
  });
});
