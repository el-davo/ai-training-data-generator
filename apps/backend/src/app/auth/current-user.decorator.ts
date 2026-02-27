import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type AuthenticatedUser = {
  userId: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const gqlCtx = GqlExecutionContext.create(context);
    return gqlCtx.getContext().req.user;
  },
);
