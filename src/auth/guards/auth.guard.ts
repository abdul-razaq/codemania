import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from '../decorators/is_public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublicRoute) return true;
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('access token is required');
    }
    const { sub, email } = this.jwtService.verify(token, {
      ignoreExpiration: false,
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      audience: this.configService.get('ACCESS_TOKEN_AUDIENCE'),
      issuer: this.configService.get('ACCESS_TOKEN_ISSUER'),
    });
    const user = await this.userRepo.findOneBy({ email, id: sub });
    request.user = user;
    return true;
  }
}
