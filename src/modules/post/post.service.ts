import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from '@/constants/pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { GraphQLResolveInfo } from 'graphql/type/definition';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  findAll(pagy: { skip?: number; take?: number }) {
    const { skip = DEFAULT_SKIP, take = DEFAULT_PAGE_SIZE } = pagy;
    return this.prisma.post.findMany({ skip, take, });
  }

  count() {
    return this.prisma.post.count();
  }

  findOne(id: number, info: GraphQLResolveInfo) {
    const fields = (parseResolveInfo(info)?.fieldsByTypeName?.Post || {}) as Record<string, ResolveTree>;

    return this.prisma.post.findUnique({
      where: { id },
      include: {
        user: !!fields.user,
        tags: !!fields.tags,
      },
    });
  }
}
