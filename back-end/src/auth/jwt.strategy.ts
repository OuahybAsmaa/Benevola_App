import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ✅ Utiliser ConfigService au lieu de hardcoder le secret
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret_key',
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  // ✅ Retourner une structure cohérente pour req.user
  async validate(payload: any) {
    console.log('🔍 JWT Payload reçu:', payload); // Pour debugging

    // ✅ Créer une structure normalisée
    const user = {
      // Priorité : sub > userId > id
      userId: payload.sub || payload.userId || payload.id,
      id: payload.sub || payload.userId || payload.id,
      sub: payload.sub || payload.userId || payload.id,
      email: payload.email,
      role: payload.role,
      // Conserver toutes les autres propriétés du payload
      ...payload,
    };

    console.log('🔍 User retourné:', user); // Pour debugging

    return user;
  }
}