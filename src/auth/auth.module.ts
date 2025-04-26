import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './passport/strategies/google.strategy';
import { GoogleOAuthController } from './google-oauth.controller';
import { JwtStrategy } from './passport/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      })
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    JwtStrategy,
    GoogleStrategy,
  ],
  controllers: [GoogleOAuthController],
})
export class AuthModule {}
