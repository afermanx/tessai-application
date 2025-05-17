import { Entity, Column } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ nullable: true })
  avatar: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column({ nullable: true, name: 'google_id' })
  googleId: string;
}
