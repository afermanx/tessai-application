import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Conversation } from './Conversation';
import { User } from './User';

export enum SenderType {
  USER = 'user',
  ASSISTANT = 'assistant',
}
@Entity('messages')
export class Message extends BaseEntity {
  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: SenderType })
  sender: SenderType;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;
}
