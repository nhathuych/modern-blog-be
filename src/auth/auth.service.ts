import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/sign.in.input';
import { PrismaService } from '@/prisma/prisma.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser({ email, password }: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('User not found.');

    const isPasswordMatched = await verify(user.password as string, password);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid password.');

    return user;
  }
}
