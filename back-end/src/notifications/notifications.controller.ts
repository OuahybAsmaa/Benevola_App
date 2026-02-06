import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, GetNotificationsDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt')) 
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @Request() req,
    @Query() query: GetNotificationsDto,
  ) {
    const { page = 1, limit = 20, isRead } = query;
    return this.notificationsService.getUserNotifications(
      req.user.id,
      page,
      limit,
      isRead,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.notificationsService.delete(id);
    return { message: 'Notification deleted' };
  }
}