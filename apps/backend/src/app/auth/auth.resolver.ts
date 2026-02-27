import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser, type AuthenticatedUser } from './current-user.decorator';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthPayload, SigninInput, SignupInput, SignupPayload, User } from './graphql.types';
import { UserEntity } from './user.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignupPayload)
  async signup(@Args('input') input: SignupInput): Promise<SignupPayload> {
    const user = await this.authService.signup(input);
    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  @Mutation(() => AuthPayload)
  async signin(@Args('input') input: SigninInput): Promise<AuthPayload> {
    const { user, accessToken } = await this.authService.signin(input);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() authUser: AuthenticatedUser): Promise<User> {
    const user = await this.authService.findById(authUser.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.toGraphqlUser(user);
  }

  private toGraphqlUser(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

