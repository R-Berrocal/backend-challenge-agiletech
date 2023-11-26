import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserInput, UserOutput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserRole } from 'src/enums/user-role.enum';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async create({
    password,
    ...createUser
  }: CreateUserInput): Promise<UserOutput> {
    try {
      const user = this.usersRepository.create({
        ...createUser,
        password: await bcrypt.hashSync(password, 10),
      });

      return {
        ok: true,
        user: await this.usersRepository.save(user),
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        relations: ['reports'],
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOneUser(id: string): Promise<UserOutput> {
    try {
      const user = await this.findOne(id);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    authUser: User,
  ): Promise<UserOutput> {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hashSync(
        updateUserInput.password,
        10,
      );
    }
    await this.findOne(id);
    this.validateUserAuth(id, authUser);
    try {
      const user = await this.usersRepository.preload({
        id,
        ...updateUserInput,
      });

      await this.usersRepository.save(user);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async remove(id: string, authUser: User): Promise<UserOutput> {
    const user = await this.findOne(id);
    this.validateUserAuth(id, authUser);
    try {
      await this.usersRepository.softDelete(id);
      return {
        ok: true,
        user,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['reports'],
    });
    if (!user) {
      throw new NotFoundException('Equipment not found');
    }
    return user;
  }

  validateUserAuth(idUser: string, authUser: User) {
    if (idUser !== authUser.id && authUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You do not have permissions');
    }
  }
}
