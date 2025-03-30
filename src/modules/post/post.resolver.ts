import { Resolver, Query, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';
import { DataLoaderFactory } from '@/common/dataloader/dataloader.factory';

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

  @ResolveField(() => User, { nullable: true })
  user(@Parent() post: Post) {
    return this.userLoader.load(post.userId);
  }

  @ResolveField(() => [Tag])
  tags(@Parent() post: Post) {
    return this.tagsLoader.load(post.id);
  }
}
