import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from '@/constants/pagination';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

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

  findOne(id: number) {
    return this.prisma.post.findUnique({ where: { id }, });
  }

  findAllByUserId(params: { userId: number, skip?: number, take?: number}) {
    const { userId, skip = DEFAULT_SKIP, take = DEFAULT_PAGE_SIZE } = params;

    return this.prisma.post.findMany({
      where: { userId },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        thumbnail: true,
        createdAt: true,
        published: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      },
      orderBy: { id: 'desc' },
      skip,
      take,
    });
  }

  countByUserId(userId: number) {
    return this.prisma.post.count({ where: { userId } });
  }

  async create({ userId, createPostInput }: { userId: number; createPostInput: CreatePostInput }) {
    const baseSlug = this.slugify(createPostInput.title);
    const slug = await this.generateUniqueSlug(baseSlug);

    return this.prisma.post.create({
      data: {
        ...createPostInput,
        slug,
        user: { connect: { id: userId } },
        tags: {
          connectOrCreate: createPostInput.tags?.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      }
    });
  }

  async update({ userId, updatePostInput }: { userId: number; updatePostInput: UpdatePostInput }) {
    const post = await this.prisma.post.findUnique({
      where: { id: updatePostInput.id, userId },
    });
    if (!post) throw new UnauthorizedException('Post not found or user not authorized');

    const { id, ...attrs } = updatePostInput;
    return this.prisma.post.update({
      where: { id: updatePostInput.id },
      data: {
        ...attrs,
        tags: {
          set: [], // clear existing tags
          connectOrCreate: updatePostInput.tags?.map((tag) => {
            const name = tag.trim();
            return {
              where: { name },
              create: { name },
            }
          }),
        },
      },
    });
  }

  async delete({ id, userId }: { userId: number; id: number }) {
    const post = await this.prisma.post.findUnique({
      where: { id, userId },
    });
    if (!post) throw new UnauthorizedException('Post not found or user not authorized');

    const result = await this.prisma.post.delete({ where: { id } })

    return !!result
  }

  private slugify(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  private async generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let count = 0;

    while (true) {
      const existing = await this.prisma.post.findUnique({ where: { slug } });
      if (!existing) break;

      count++;
      slug = `${baseSlug}-${count}`;
    }

    return slug;
  }
}
