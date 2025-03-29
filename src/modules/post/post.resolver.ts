import { Resolver, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard) // authen token
  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }
}
