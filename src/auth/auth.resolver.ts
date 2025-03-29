import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/sign.in.input';
import { SignInResponse } from './types/sign-in.response';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResponse)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    const user = await this.authService.validateUser(signInInput);

    return await this.authService.login(user)
  }
}
