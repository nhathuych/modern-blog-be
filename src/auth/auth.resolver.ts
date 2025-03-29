import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign.in.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String) // "String" is a GraphQL type
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.validateUser(signInInput);

    return user ? "Logged in successfully." : "Logged in failed."
  }
}
