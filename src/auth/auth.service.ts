import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/sign.in.input';
import { PrismaService } from '@/prisma/prisma.service';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwt-payload';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('User not found.');

    const isPasswordMatched = await verify(user.password as string, password);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid password.');

    return user;
  }

  generateToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.signAsync(payload);
  }

  async login(user: User) {
    const accessToken = await this.generateToken(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      accessToken,
    };
  }
}
