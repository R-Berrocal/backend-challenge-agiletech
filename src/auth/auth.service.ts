import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/login.input';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { SignupInput } from './dto/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const { user } = await this.usersService.create(signupInput);

    const token = this.getJwtToken(user.id);
    return {
      user,
      token,
    };
  }

  async login({ email, password }: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email / Password do not match');
    }
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const { user } = await this.usersService.findOne(id);
    if (!user) {
      throw new UnauthorizedException(`User is inactive, talk with an admin`);
    }

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      token,
      user,
    };
  }
}
