import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
