import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The user email address',
    example: 'foobar@codemania.ng',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'user email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password to enable them login to their acccount',
    example: 'changePasswordLater01',
    minLength: 8,
  })
  @IsAlphanumeric('en-US', {
    message: 'user password must contain letters and numbers',
  })
  @NotContains('password', {
    message: "user password cannot contain the word 'password'",
  })
  @MinLength(8, { message: 'user password must be at least 8 characters' })
  @IsNotEmpty({ message: 'user password is required' })
  password: string;
}
