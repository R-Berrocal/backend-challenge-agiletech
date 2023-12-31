import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { CoreOutput } from 'src/common/dto/core.output';
import { UserRole } from 'src/enums/user-role.enum';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  lastName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => UserRole, { nullable: true })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

@ObjectType()
export class UserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
