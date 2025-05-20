import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('conversations/:id/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(@Param('id') conversationId: number, @Body() dto: CreateMessageDto) {
    return this.messageService.create(conversationId, dto);
  }

  @Get()
  findAll(@Param('id') conversationId: number) {
    return this.messageService.findAll(conversationId);
  }

  @Delete(':msgId')
  remove(@Param('msgId') msgId: number) {
    return this.messageService.remove(msgId);
  }
}
