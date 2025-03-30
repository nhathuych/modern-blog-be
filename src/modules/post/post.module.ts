import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '@/prisma/prisma.service';
import { DataLoaderModule } from '../common/dataloader/dataloader.module';

@Module({
  imports: [DataLoaderModule],
  providers: [PostResolver, PostService, PrismaService],
})
export class PostModule {}
