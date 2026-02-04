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
import { AuthGuard } from '@nestjs/passport'; // ✅ AJOUTER
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
@UseGuards(AuthGuard('jwt')) // ✅ CHANGER de JwtStrategy à AuthGuard('jwt')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // Créer un message (HTTP fallback)
  @Post()
  async create(@Request() req, @Body() createMessageDto: CreateMessageDto) {
    // ✅ Extraire userId de manière robuste
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    console.log('🔍 [POST /messages] req.user:', req.user);
    console.log('🔍 [POST /messages] userId extrait:', userId);
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    return await this.messagesService.create(userId, createMessageDto);
  }

  // Récupérer une conversation
  @Get('conversation/:otherUserId')
  async getConversation(
    @Request() req,
    @Param('otherUserId') otherUserId: string,
    @Query('missionId') missionId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    // ✅ Extraire userId de manière robuste
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    console.log('🔍 [GET /conversation] req.user:', req.user);
    console.log('🔍 [GET /conversation] userId extrait:', userId);
    console.log('🔍 [GET /conversation] otherUserId:', otherUserId);
    
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

  // Récupérer toutes les conversations
  @Get('conversations')
  async getUserConversations(@Request() req) {
    // ✅ Extraire userId de manière robuste
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    console.log('🔍 [GET /conversations] req.user:', req.user);
    console.log('🔍 [GET /conversations] userId extrait:', userId);
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    return await this.messagesService.getUserConversations(userId);
  }

  // Compter les messages non lus
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    // ✅ Extraire userId de manière robuste
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    console.log('🔍 [GET /unread-count] req.user:', req.user);
    console.log('🔍 [GET /unread-count] userId extrait:', userId);
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }

  // Marquer comme lu
  @Post('mark-read/:senderId')
  async markAsRead(
    @Request() req,
    @Param('senderId') senderId: string,
    @Query('missionId') missionId?: string,
  ) {
    // ✅ Extraire userId de manière robuste
    const userId = req.user?.userId || req.user?.sub || req.user?.id;
    
    console.log('🔍 [POST /mark-read] req.user:', req.user);
    console.log('🔍 [POST /mark-read] userId extrait:', userId);
    
    if (!userId) {
      throw new Error('Utilisateur non authentifié');
    }

    await this.messagesService.markAsRead(userId, senderId, missionId);
    return { success: true };
  }
}