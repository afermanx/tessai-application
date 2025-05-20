import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SenderType } from '../entities/Message';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  const mockMessageService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar messageService.create com os parâmetros corretos', async () => {
      const dto: CreateMessageDto = {
        content: 'Olá',
        sender: SenderType.USER,
        userId: 1,
      };

      const mockReturn = { id: 1, ...dto };
      mockMessageService.create.mockResolvedValue(mockReturn);

      const result = await controller.create(123, dto);
      expect(service.create).toHaveBeenCalledWith(123, dto);
      expect(result).toEqual(mockReturn);
    });
  });

  describe('findAll', () => {
    it('deve chamar messageService.findAll com o conversationId correto', async () => {
      const mockMessages = [{ id: 1, content: 'msg' }];
      mockMessageService.findAll.mockResolvedValue(mockMessages);

      const result = await controller.findAll(123);
      expect(service.findAll).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockMessages);
    });
  });

  describe('remove', () => {
    it('deve chamar messageService.remove com o msgId correto', async () => {
      mockMessageService.remove.mockResolvedValue(undefined);

      await controller.remove(999);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
