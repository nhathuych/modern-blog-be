import { Resolver, Query, Mutation, Context, Args, Int } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth/jwt-auth.guard';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  likePost(@Context() context, @Args('postId', { type: () => Int! }) postId: number) {
    const userId = +context.req.user.id;
    return this.likeService.likePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  unlikePost(@Context() context, @Args('postId', { type: () => Int! }) postId: number) {
    const userId = +context.req.user.id;
    return this.likeService.unlikePost(userId, postId);
  }

  @Query(() => Number)
  getPostLikes(@Args('postId', { type: () => Int! }) postId: number) {
    return this.likeService.getPostLikes(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Boolean)
  isUserLikedPost(@Context() context, @Args('postId', { type: () => Int! }) postId: number) {
    const userId = +context.req.user.id;
    return this.likeService.isUserLikedPost(userId, postId);
  }
}
