import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { DataLoaderModule } from '../common/dataloader/dataloader.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, DataLoaderModule],
  providers: [CommentResolver, CommentService],
})
export class CommentModule {}
