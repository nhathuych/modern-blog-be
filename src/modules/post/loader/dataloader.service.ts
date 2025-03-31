import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Scope } from '@nestjs/common';
import * as DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderService {
  constructor(private prisma: PrismaService) {}

  // User loader
  readonly userLoader = new DataLoader(async (userIds: number[]) => {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    
    // Map the users to ensure they are returned in the same order as the keys
    return userIds.map(id => users.find(user => user.id === id) || null);
  });

  // Tags loader - for many-to-many relationship
  readonly postTagsLoader = new DataLoader(async (postIds: number[]) => {
    const postTags = await this.prisma.tag.findMany({
      where: {
        posts: {
          some: {
            id: { in: postIds as number[] },
          },
        },
      },
      include: {
        posts: {
          select: {
            id: true,
          },
        },
      },
    });

    // Group tags by post ID
    const tagsByPostId = postIds.map(postId => {
      return postTags
        .filter(tag => tag.posts.some(post => post.id === postId))
        .map(({ posts, ...tag }) => tag); // Remove the posts field
    });

    return tagsByPostId;
  });
}
