import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { CommentModule } from './modules/comment/comment.module';
import { TagModule } from './modules/tag/tag.module';
import { LikeModule } from './modules/like/like.module';
import { AuthModule } from './auth/auth.module';
import { LoaderModule } from './modules/post/loader/loader.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/graphql/schema.gql")
    }),
    AuthModule,
    PrismaModule,
    PostModule,
    UserModule,
    CommentModule,
    TagModule,
    LikeModule,
    LoaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
