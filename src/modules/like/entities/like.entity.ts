import { Post } from '@/modules/post/entities/post.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Like {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field(() => Post)
  post: Post;

  @Field()
  createdAt: Date;
}
