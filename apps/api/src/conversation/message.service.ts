import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, SenderType } from '../entities/Message';
import { Conversation } from '../entities/Conversation';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../entities/User';
import { ChatGptService } from '../chat/chatgpt.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,

    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private chatGptService: ChatGptService,
  ) {}

  async createAndReply(dto: CreateMessageDto): Promise<{
    userMessage: Message;
    assistantMessage: Message;
    conversation: Conversation;
  }> {
    let conversation: Conversation | null = null;

    if (dto.conversationId) {
      conversation = await this.conversationRepo.findOneBy({
        id: dto.conversationId,
      });
      if (!conversation) {
        throw new NotFoundException('Conversa não encontrada');
      }
    } else {
      if (!dto.userId) {
        throw new NotFoundException(
          'Usuário não informado para criar nova conversa',
        );
      }

      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      conversation = this.conversationRepo.create({
        title: dto.content,
        user,
      });
      await this.conversationRepo.save(conversation);
    }

    const user = dto.userId
      ? await this.userRepo.findOne({ where: { id: dto.userId } })
      : undefined;

    const userMessage = this.messageRepo.create({
      content: dto.content,
      sender: SenderType.USER,
      ...(user && { user }),
      conversation,
    });
    await this.messageRepo.save(userMessage);

    const chatResponses = await this.chatGptService.askQuestion(dto.content);
    const assistantContent =
      chatResponses[0]?.content ?? 'Sem resposta do assistente.';

    const assistantMessage = this.messageRepo.create({
      content: assistantContent,
      sender: SenderType.ASSISTANT,
      conversation,
    });
    await this.messageRepo.save(assistantMessage);

    if (!conversation.title || conversation.title.trim() === '') {
      conversation.title = userMessage.content;
      await this.conversationRepo.save(conversation);
    }

    return { userMessage, assistantMessage, conversation };
  }

  async create(
    conversationId: number,
    dto: CreateMessageDto,
  ): Promise<Message> {
    const conversation = await this.conversationRepo.findOneBy({
      id: conversationId,
    });
    if (!conversation) throw new NotFoundException('Conversa não encontrada');

    // Verifica se o sender é válido
    if (!Object.values(SenderType).includes(dto.sender)) {
      throw new NotFoundException('Sender inválido');
    }

    const messageData: Partial<Message> = {
      content: dto.content,
      sender: dto.sender,
      conversation,
    };

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      messageData.user = user;
    }
    const message = this.messageRepo.create(messageData);
    return this.messageRepo.save(message);
  }

  async findAll(conversationId: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
    });
  }

  async remove(id: number): Promise<void> {
    const msg = await this.messageRepo.findOneBy({ id });
    if (!msg) throw new NotFoundException('Mensagem não encontrada');
    await this.messageRepo.remove(msg);
  }
}
