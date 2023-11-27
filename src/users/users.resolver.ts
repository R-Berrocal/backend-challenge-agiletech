import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UserOutput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserOutput)
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Auth(UserRole.ADMIN, UserRole.TECHNICIAN)
  @Query(() => [User], { name: 'getUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @Auth()
  @Query(() => UserOutput, { name: 'getUser' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOneUser(id);
  }

  @Auth()
  @Mutation(() => UserOutput)
  updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Auth()
  @Mutation(() => UserOutput)
  removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.remove(id, user);
  }
}
