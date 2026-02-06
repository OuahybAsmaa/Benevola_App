import { Body, Controller, Post, UseGuards, Get, Req, Request, Patch } from '@nestjs/common'; 
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { FirebasePushService } from '../notifications/firebase-push.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebasePushService: FirebasePushService 
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: { firstName: string; lastName: string; email: string; password: string; role: 'benevole' | 'organisation' }): Promise<any> {
    return this.authService.register(body);
  }

  @Post('refresh')
  refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshAccessToken(body.refresh_token);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Post('logout')
  logout(@Req() req: any) { 
    return this.authService.logout(req.user.sub); 
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('me')
  me(@Req() req: any) { 
    return this.authService.getUserById(req.user.sub);
  }

 
  @Post('fcm-token')
  @UseGuards(AuthGuard('jwt'))
  async registerFcmToken(
    @Req() req: any, 
    @Body() body: { fcmToken: string },
  ) {
    await this.firebasePushService.registerFcmToken(req.user.id, body.fcmToken);
    return { message: 'FCM token registered successfully' };
  }

  
  @Patch('fcm-token/remove')
  @UseGuards(AuthGuard('jwt'))
  async removeFcmToken(@Req() req: any) { 
    await this.firebasePushService.unregisterFcmToken(req.user.id);
    return { message: 'FCM token removed successfully' };
  }
}