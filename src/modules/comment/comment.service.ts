import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from '@/constants/pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  findManyByPost(postId: number, take = DEFAULT_PAGE_SIZE, skip = DEFAULT_SKIP) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { id: 'desc' },
      take,
      skip,
    })
  }

  countByPost(postId: number) {
    return this.prisma.comment.count({
      where: { postId },
    })
  }

  async create(createCommentInput: CreateCommentInput, userId: number) {
    return this.prisma.comment.create({
      data: {
        content: createCommentInput.content,
        post: {
          connect: { id: createCommentInput.postId } // Validate and connect the comment to an existing post by ID
        },
        user: {
          connect: { id: userId } // Validate and connect the comment to an existing user by ID
        }
      }
    })
  }
}
