import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput, UserOutput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserOutput)
  createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UserOutput, { name: 'getUser' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOneUser(id);
  }

  @Mutation(() => UserOutput)
  updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => UserOutput)
  removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.usersService.remove(id, user);
  }
}
