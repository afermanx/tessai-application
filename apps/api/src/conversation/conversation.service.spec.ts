import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Conversation } from '../entities/Conversation';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { MessageService } from './message.service';
import { NotFoundException } from '@nestjs/common';

const mockConversationRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockMessageService = () => ({
  // Adicione métodos conforme necessário
});

describe('ConversationService', () => {
  let service: ConversationService;
  let conversationRepo: jest.Mocked<Repository<Conversation>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        { provide: MessageService, useFactory: mockMessageService },
        {
          provide: getRepositoryToken(Conversation),
          useFactory: mockConversationRepository,
        },
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    conversationRepo = module.get(getRepositoryToken(Conversation));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a conversation if user exists', async () => {
      const dto = { title: 'Test', userId: 1 };
      const user = { id: 1, name: 'John' } as User;
      const conversation = { id: 1, title: dto.title, user } as Conversation;

      userRepo.findOne.mockResolvedValue(user);
      conversationRepo.create.mockReturnValue(conversation);
      conversationRepo.save.mockResolvedValue(conversation);

      const result = await service.create(dto);

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: dto.userId },
      });
      expect(conversationRepo.create).toHaveBeenCalledWith({
        title: dto.title,
        user,
      });
      expect(conversationRepo.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual(conversation);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({ title: 'Test', userId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all conversations', async () => {
      const conversations = [{ id: 1, title: 'A' }] as Conversation[];
      conversationRepo.find.mockResolvedValue(conversations);

      expect(await service.findAll()).toEqual(conversations);
    });
  });

  describe('findOne', () => {
    it('should return a conversation by id', async () => {
      const conv = {
        id: 1,
        title: 'C',
        user: {
          id: 1,
          avatar: 'avatar.png',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedpassword',
        } as User,
        messages: [],
        isActive: true,
        externalId: '', // <-- string vazia em vez de null
        createdAt: new Date(),
        updatedAt: new Date(),
        generateId: () => {},
      } as Conversation;
      conversationRepo.findOne.mockResolvedValue(conv);

      expect(await service.findOne(1)).toEqual(conv);
      expect(conversationRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'messages'],
      });
    });

    it('should throw NotFoundException if conversation not found', async () => {
      conversationRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a conversation', async () => {
      const oldConv = { id: 1, title: 'Old Title' } as Conversation;
      const updatedConv = { id: 1, title: 'New Title' } as Conversation;

      jest.spyOn(service, 'findOne').mockResolvedValue(oldConv);
      conversationRepo.save.mockResolvedValue(updatedConv);

      const result = await service.update(1, { title: 'New Title' });

      expect(result).toEqual(updatedConv);
      expect(conversationRepo.save).toHaveBeenCalledWith({
        ...oldConv,
        title: 'New Title',
      });
    });
  });

  describe('remove', () => {
    it('should remove a conversation', async () => {
      const conv = { id: 1, title: 'Delete Me' } as Conversation;
      jest.spyOn(service, 'findOne').mockResolvedValue(conv);

      await service.remove(1);

      expect(conversationRepo.remove).toHaveBeenCalledWith(conv);
    });
  });
});
