import { Resolver, Query, Args, Int, ResolveField, Parent, Context, Mutation } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';
import { DataLoaderFactory } from '@/common/dataloader/dataloader.factory';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/passport/guards/jwt-auth/jwt-auth.guard';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostResolver {
  private userLoader;
  private tagsLoader;

  constructor(
    private readonly postService: PostService,
    private readonly loaderFactory: DataLoaderFactory,
  ) {
    // Pass the model name as a string
    this.userLoader = this.loaderFactory.createOneToOneLoader('user');
    this.tagsLoader = this.loaderFactory.createManyToManyLoader('tag', 'posts');
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.postService.findAll({ skip, take });
  }

  @Query(() => Int, { name: 'postCount' })
  postCount() {
    return this.postService.count();
  }

  @Query(() => Post)
  findPostById(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Post])
  getUserPosts(
    @Context() context,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ) {
    const userId = context.req.user.id;
    return this.postService.findAllByUserId({ userId, skip, take });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Int)
  getUserPostCount(@Context() context) {
    const userId = context.req.user.id;
    return this.postService.countByUserId(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(@Context() context, @Args('createPostInput') createPostInput: CreatePostInput) {
    const userId = +context.req.user.id;
    return this.postService.create({ userId, createPostInput });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  updatePost(@Context() context, @Args('updatePostInput') updatePostInput: UpdatePostInput) {
    const userId = +context.req.user.id;
    return this.postService.update({ userId, updatePostInput });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  deletePost(@Context() context, @Args('id', { type: () => Int }) id: number) {
    const userId = +context.req.user.id;
    return this.postService.delete({ id, userId });
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() post: Post) {
    return this.userLoader.load(post.userId);
  }

  @ResolveField(() => [Tag])
  tags(@Parent() post: Post) {
    return this.tagsLoader.load(post.id);
  }
}
