import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret_key',
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }


  async validate(payload: any) {

    const user = {

      userId: payload.sub || payload.userId || payload.id,
      id: payload.sub || payload.userId || payload.id,
      sub: payload.sub || payload.userId || payload.id,
      email: payload.email,
      role: payload.role,
      ...payload,
    };

    return user;
  }
}