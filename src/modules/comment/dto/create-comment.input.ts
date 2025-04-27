import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsNumber()
  @Field(() => Int)
  postId: number;

  @IsString()
  @Field(() => String)
  content: string;
}
