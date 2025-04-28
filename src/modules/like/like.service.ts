import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async likePost(userId: number, postId: number) {
    try {
      await this.prisma.like.create({ data: { userId, postId }, });
    } catch (error) {
      if (error.code === 'P2002') return true; // ignore duplicate key error
      throw error;
    }

    return true;
  }

  async unlikePost(userId: number, postId: number) {
    const result = await this.prisma.like.deleteMany({ where: { userId, postId } });
    return result.count > 0;
  }

  getPostLikes(postId: number) {
    return this.prisma.like.count({ where: { postId } });
  }

  async isUserLikedPost(userId: number, postId: number) {
    const like = await this.prisma.like.findUnique({ where: { userId_postId: { userId, postId } } });
    return !!like;
  }
}
