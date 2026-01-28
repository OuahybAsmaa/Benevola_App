import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common'; 
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  logout(@Req() req) {
    return this.authService.logout(req.user.sub); // sub = user.id
  }

  @UseGuards(AuthGuard('jwt')) 
  @Get('me')
  me(@Req() req) {
    return this.authService.getUserById(req.user.sub);
  }
}