import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'The user first name',
    example: 'Raman',
  })
  @MinLength(3, { message: 'user firstname must be at least 3 characters' })
  @MaxLength(20, { message: 'user firstname must be at most 20 characters' })
  @IsNotEmpty({ message: 'user firstname is required' })
  firstname: string;

  @ApiProperty({
    description: 'The user last name',
    example: 'Raman',
  })
  @MinLength(3, { message: 'user lastname must be at least 3 characters' })
  @MaxLength(20, { message: 'user lastname must be at most 20 characters' })
  @IsNotEmpty({ message: 'user lastname is required' })
  lastname: string;

  @ApiProperty({
    description: 'The user email address',
    example: 'foobar@codemania.ng',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'user email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The user password to enable them login to their account',
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

  @ApiProperty({
    description: 'repeat password to verify supplied password',
    example: 'changePasswordLater01',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'password repeat is required' })
  passwordRepeat: string;
}
