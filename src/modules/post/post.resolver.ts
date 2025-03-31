import { Resolver, Query, Args, Int, Info, ResolveField, Parent } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { GraphQLResolveInfo } from 'graphql/type/definition';
import { DataLoaderService } from './loader/dataloader.service';
import { User } from '../user/entities/user.entity';
import { Tag } from '../tag/entities/tag.entity';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly loaderService: DataLoaderService,
  ) {}

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
  findPostById(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.postService.findOne(id, info)
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() post: Post) {
    return this.loaderService.userLoader.load(post.userId);
  }

  @ResolveField(() => [Tag])
  tags(@Parent() post: Post) {
    return this.loaderService.postTagsLoader.load(post.id);
  }
}
