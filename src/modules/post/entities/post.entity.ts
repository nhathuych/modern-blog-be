import { Comment } from '@/modules/comment/entities/comment.entity';
import { Tag } from '@/modules/tag/entities/tag.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  content: string;

  @Field()
  published: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @Field(() => [Tag], { nullable: true })
  tags: Tag[];
}
