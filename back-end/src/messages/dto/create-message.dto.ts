import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  receiverId: string;

  @IsOptional()
  @IsUUID()
  missionId?: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}