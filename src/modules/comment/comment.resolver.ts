import { Resolver, Query, Args, Int, Parent, ResolveField, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { DEFAULT_PAGE_SIZE, DEFAULT_SKIP } from '@/constants/pagination';
import { DataLoaderFactory } from '@/common/dataloader/dataloader.factory';
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth/jwt-auth.guard';
import { CreateCommentInput } from './dto/create-comment.input';

@Resolver(() => Comment)
export class CommentResolver {
  private userLoader;

  constructor(private commentService: CommentService, private loaderFactory: DataLoaderFactory) {
    // Pass the model name as a string
    this.userLoader = this.loaderFactory.createOneToOneLoader('user');
  }

  @Query(() => [Comment])
  getCommentsByPost(
    @Args('postId', { type: () => Int! }) postId: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: DEFAULT_PAGE_SIZE }) take?: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: DEFAULT_SKIP })      skip?: number,
  ) {
    return this.commentService.findManyByPost(postId, take, skip);
  }

  @Query(() => Int)
  getTotalByPost(@Args('postId', { type: () => Int! }) postId: number) {
    return this.commentService.countByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Comment)
  createComment(@Context() context, @Args('createCommentInput') createCommentInput: CreateCommentInput) {
    const userId = +context.req.user.id;
    return this.commentService.create(createCommentInput, userId);
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() post: Post) {
    return this.userLoader.load(post.userId);
  }
}
