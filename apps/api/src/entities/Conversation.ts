import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { BaseEntity } from './BaseEntity';
import { Message } from './Message';

@Entity({ name: 'conversations' })
export class Conversation extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.conversations)
  user: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
