import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../entities/Conversation';
import { User } from '../entities/User';
import { Message } from '../entities/Message';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatGptService } from '../chat/chatgpt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Message])],
  controllers: [ConversationController, MessageController],
  providers: [ConversationService, MessageService, ChatGptService],
})
export class ConversationModule {}
