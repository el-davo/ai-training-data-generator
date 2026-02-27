import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}

@InputType()
export class SigninInput {
  @Field()
  @IsEmail()
  @MaxLength(320)
  email!: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  password!: string;
}

@ObjectType()
export class User {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  createdAt!: Date;
}

@ObjectType()
export class SignupPayload {
  @Field()
  user!: User;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field()
  user!: User;
}

