import { DataLoaderFactory } from '@/common/dataloader/dataloader.factory';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [DataLoaderFactory],
  exports: [DataLoaderFactory],
})
export class DataLoaderModule {}
