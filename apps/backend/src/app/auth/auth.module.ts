import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { StringValue } from 'ms';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('NODE_ENV') ?? 'development';
        const secret = config.get<string>('JWT_SECRET');
        if (!secret && nodeEnv === 'production') {
          throw new Error('JWT_SECRET is required in production');
        }
        const expiresIn = (config.get<string>('JWT_EXPIRES_IN') ??
          '1h') as StringValue;

        return {
          secret: secret ?? 'dev-only-jwt-secret',
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, GqlAuthGuard],
})
export class AuthModule {}

