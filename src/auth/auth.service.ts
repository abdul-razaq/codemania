import * as argon2 from 'argon2';
import { SignUpDto } from './dtos/signup.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  private generateAccessToken(user: User) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      if (signUpDto.password !== signUpDto.passwordRepeat) {
        throw new BadRequestException('passwords must match');
      }
      const user = new User();
      user.firstName = signUpDto.firstname;
      user.lastName = signUpDto.lastname;
      user.email = signUpDto.email;
      user.password = signUpDto.password;

      const savedUser = await this.userRepo.save(user);

      const token = this.generateAccessToken(savedUser);
      delete user.password;
      return {
        user: savedUser,
        token,
      };
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException('email address already exists');
      }
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new ForbiddenException('email address does not exist');
    }
    const isValidPassword = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!isValidPassword) {
      throw new ForbiddenException('email address or password is invalid');
    }
    delete user.password;
    const token = this.generateAccessToken(user);
    return {
      user,
      token,
    };
  }
}
