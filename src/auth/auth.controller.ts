import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicRoute } from './decorators/is_public.decorator';
import { LoginDto } from './dtos/login.dto';
import { SignUpDto } from './dtos/signup.dto';

@ApiTags('Auth')
@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'user account created successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({
    description: 'validation error, check request body',
  })
  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @ApiOkResponse({ description: 'logged in successfully' })
  @ApiTooManyRequestsResponse({ description: 'too many requests received' })
  @ApiBadRequestResponse({
    description: 'validation error, check request body',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
