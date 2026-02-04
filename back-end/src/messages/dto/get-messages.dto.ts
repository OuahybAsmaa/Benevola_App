import { IsNotEmpty, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMessagesDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  missionId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number = 50;
}