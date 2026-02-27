import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
    const secret = config.get<string>('JWT_SECRET');
    if (!secret && nodeEnv === 'production') {
      throw new Error('JWT_SECRET is required in production');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret ?? 'dev-only-jwt-secret',
    });
  }

  async validate(payload: JwtPayload): Promise<{ userId: string; email: string }> {
    const user = await this.authService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: user.id,
      email: user.email,
    };
  }
}

