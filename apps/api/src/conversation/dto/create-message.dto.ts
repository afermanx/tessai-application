import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { SenderType } from '../../entities/Message';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(SenderType)
  sender: SenderType;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  conversationId?: number;
}
