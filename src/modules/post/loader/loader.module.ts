import { Module } from '@nestjs/common';
import { DataLoaderService } from './dataloader.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class LoaderModule {}
