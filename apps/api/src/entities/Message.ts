import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './User';

import { BaseEntity } from './BaseEntity';

@Entity({ name: 'messages' })
export class Message extends BaseEntity {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;
}
