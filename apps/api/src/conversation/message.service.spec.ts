import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message, SenderType } from '../entities/Message';
import { Conversation } from '../entities/Conversation';
import { User } from '../entities/User';
import { ChatGptService } from '../chat/chatgpt.service';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';

// Criando mocks dos repositórios
const mockMessageRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
});

const mockConversationRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
});

const mockUserRepo = () => ({
  findOne: jest.fn(),
});

const mockChatGptService = {
  askQuestion: jest.fn(),
};

describe('MessageService', () => {
  let service: MessageService;
  let messageRepo: jest.Mocked<Repository<Message>>;
  let conversationRepo: jest.Mocked<Repository<Conversation>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let chatGptService: ChatGptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: getRepositoryToken(Message), useFactory: mockMessageRepo },
        {
          provide: getRepositoryToken(Conversation),
          useFactory: mockConversationRepo,
        },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: ChatGptService, useValue: mockChatGptService },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    messageRepo = module.get(getRepositoryToken(Message));
    conversationRepo = module.get(getRepositoryToken(Conversation));
    userRepo = module.get(getRepositoryToken(User));
    chatGptService = module.get<ChatGptService>(ChatGptService);
  });

  describe('createAndReply', () => {
    it('deve criar nova conversa e retornar mensagens', async () => {
      const dto: CreateMessageDto = {
        content: 'Olá!',
        userId: 1,
        sender: SenderType.USER, // Adicionado sender aqui
      };

      const mockUser: User = { id: 1 } as User;
      const mockConversation: Conversation = {
        id: 1,
        title: '',
        user: mockUser,
      } as Conversation;
      const mockUserMessage: Message = {
        id: 1,
        content: dto.content,
        sender: SenderType.USER,
        conversation: mockConversation,
      } as Message;
      const mockAssistantMessage: Message = {
        id: 2,
        content: 'Oi, tudo bem?',
        sender: SenderType.ASSISTANT,
        conversation: mockConversation,
      } as Message;

      userRepo.findOne.mockResolvedValue(mockUser);
      conversationRepo.create.mockReturnValue(mockConversation);
      conversationRepo.save.mockResolvedValue(mockConversation);

      messageRepo.create
        .mockReturnValueOnce(mockUserMessage) // para userMessage
        .mockReturnValueOnce(mockAssistantMessage); // para assistantMessage
      messageRepo.save
        .mockResolvedValueOnce(mockUserMessage)
        .mockResolvedValueOnce(mockAssistantMessage);

      chatGptService.askQuestion = jest
        .fn()
        .mockResolvedValue([{ content: 'Oi, tudo bem?' }]);

      const result = await service.createAndReply(dto);

      expect(result.userMessage).toEqual(mockUserMessage);
      expect(result.assistantMessage).toEqual(mockAssistantMessage);
      expect(result.conversation).toEqual(mockConversation);
      expect(conversationRepo.save).toHaveBeenCalled();
      expect(messageRepo.save).toHaveBeenCalledTimes(2);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
      const dto: CreateMessageDto = {
        content: 'Oi',
        userId: 999,
        sender: SenderType.USER, // Adicionado sender
      };
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.createAndReply(dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar erro se conversa não for encontrada por ID', async () => {
      const dto: CreateMessageDto = {
        content: 'Oi',
        userId: 1,
        conversationId: 123,
        sender: SenderType.USER, // Adicionado sender
      };
      conversationRepo.findOneBy.mockResolvedValue(null);

      await expect(service.createAndReply(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
