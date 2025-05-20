import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation } from '../entities/Conversation';
import { User } from '../entities/User';
import { SenderType } from '../entities/Message';
import { MessageService } from './message.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private messageService: MessageService,
  ) {}

  async create(dto: CreateConversationDto): Promise<Conversation> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // 1. Cria a conversa com título temporário
    const conversation = this.conversationRepository.create({
      title: dto.title,
      user,
    });
    await this.conversationRepository.save(conversation);
    return this.conversationRepository.save(conversation);
  }

  findAll(): Promise<Conversation[]> {
    return this.conversationRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Conversation> {
    const conv = await this.conversationRepository.findOne({
      where: { id },
      relations: ['user', 'messages'],
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    return conv;
  }

  async update(id: number, dto: UpdateConversationDto): Promise<Conversation> {
    const conv = await this.findOne(id);
    Object.assign(conv, dto);
    return this.conversationRepository.save(conv);
  }

  async remove(id: number): Promise<void> {
    const conv = await this.findOne(id);
    await this.conversationRepository.remove(conv);
  }
}
