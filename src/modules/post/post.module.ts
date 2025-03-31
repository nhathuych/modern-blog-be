import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '@/prisma/prisma.service';
import { LoaderModule } from './loader/loader.module';

@Module({
  imports: [LoaderModule],
  providers: [PostResolver, PostService, PrismaService],
})
export class PostModule {}
