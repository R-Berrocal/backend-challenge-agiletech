import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserInput, UserOutput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

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
      return await this.usersRepository.find();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async findOne(id: string): Promise<UserOutput> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
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
  ): Promise<UserOutput> {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hashSync(
        updateUserInput.password,
        10,
      );
    }

    await this.findOne(id);
    try {
      const user = await this.usersRepository.preload({
        id,
        ...updateUserInput,
      });

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

  async remove(id: string): Promise<UserOutput> {
    const { user } = await this.findOne(id);
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
}
