import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { SenderType, Message } from '../entities/Message';
import { Conversation } from '../entities/Conversation';

describe('ConversationController', () => {
  let controller: ConversationController;
  let conversationService: ConversationService;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: MessageService,
          useValue: {
            createAndReply: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    conversationService = module.get<ConversationService>(ConversationService);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should call messageService.createAndReply and return correct structure', async () => {
      const dto: CreateMessageDto = {
        content: 'Olá',
        sender: SenderType.USER,
        conversationId: 1,
        userId: 1,
      };

      const mockUser = { id: dto.userId, name: 'Usuário Teste' } as any; // tipar como User se quiser
      const mockConversation = new Conversation();
      mockConversation.id = dto.conversationId!;
      mockConversation.title = 'Nova conversa';
      mockConversation.user = mockUser; // Aqui usa o objeto User

      const userMessage = new Message();
      userMessage.id = 1;
      userMessage.content = dto.content;
      userMessage.sender = dto.sender;
      // userMessage.userId = dto.userId; // NÃO EXISTE MAIS
      userMessage.user = mockUser; // usa o objeto user
      // userMessage.conversationId = dto.conversationId; // NÃO EXISTE MAIS
      userMessage.conversation = mockConversation; // usa o objeto conversation
      userMessage.isActive = true;
      // externalId provavelmente não aceita null, coloque string ou undefined
      userMessage.externalId = ''; // ou undefined
      userMessage.createdAt = new Date();
      userMessage.updatedAt = new Date();

      const assistantMessage = new Message();
      assistantMessage.id = 2;
      assistantMessage.content = 'Olá! Como posso ajudar?';
      assistantMessage.sender = SenderType.ASSISTANT;
      assistantMessage.user = undefined; // ou null, dependendo da entidade (se opcional)
      assistantMessage.conversation = mockConversation;
      assistantMessage.isActive = true;
      assistantMessage.externalId = ''; // ou undefined
      assistantMessage.createdAt = new Date();
      assistantMessage.updatedAt = new Date();

      const result = {
        userMessage,
        assistantMessage,
        conversation: mockConversation,
      };

      jest.spyOn(messageService, 'createAndReply').mockResolvedValue(result);

      await expect(controller.sendMessage(dto)).resolves.toEqual(result);
      expect(messageService.createAndReply).toHaveBeenCalledWith(dto);
    });
  });

  describe('create', () => {
    it('should call conversationService.create', () => {
      const dto: CreateConversationDto = {
        title: 'Nova conversa',
        userId: 1,
      };
      const result = { id: 1, ...dto };

      jest.spyOn(conversationService, 'create').mockReturnValue(result as any);

      expect(controller.create(dto)).toEqual(result);
      expect(conversationService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all conversations', () => {
      const result = [{ id: 1, title: 'Conversa 1' }];
      jest.spyOn(conversationService, 'findAll').mockReturnValue(result as any);

      expect(controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one conversation', () => {
      const result = { id: 1, title: 'Conversa 1' };
      jest.spyOn(conversationService, 'findOne').mockReturnValue(result as any);

      expect(controller.findOne(1)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a conversation', () => {
      const dto: UpdateConversationDto = { title: 'Atualizado' };
      const result = { id: 1, ...dto };

      jest.spyOn(conversationService, 'update').mockReturnValue(result as any);

      expect(controller.update(1, dto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a conversation', () => {
      const result = { success: true };
      jest.spyOn(conversationService, 'remove').mockReturnValue(result as any);

      expect(controller.remove(1)).toEqual(result);
    });
  });
});
