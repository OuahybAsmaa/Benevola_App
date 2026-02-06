import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    return await this.messagesService.create(userId, createMessageDto);
  }

  @Get('conversation/:otherUserId')
  async getConversation(
    @Request() req,
    @Param('otherUserId') otherUserId: string,
    @Query('missionId') missionId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié - req.user: ' + JSON.stringify(req.user));
    }

    return await this.messagesService.getConversation(
      userId,
      otherUserId,
      missionId,
      page,
      limit,
    );
  }

  @Get('conversations')
  async getUserConversations(@Request() req) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    return await this.messagesService.getUserConversations(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }

  @Post('mark-read/:senderId')
  async markAsRead(
    @Request() req,
    @Param('senderId') senderId: string,
    @Query('missionId') missionId?: string,
  ) {
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    await this.messagesService.markAsRead(userId, senderId, missionId);
    return { success: true };
  }
}