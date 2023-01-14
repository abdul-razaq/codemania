import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post to create',
    example: 'Amazing Post!',
  })
  @MinLength(5, { message: 'post title should not be less than 5 characters' })
  @MaxLength(150, {
    message: 'post title should not be more than 150 characters',
  })
  @IsNotEmpty({ message: 'post title is required' })
  title: string;

  @ApiProperty({
    description: 'The post to create',
    example: 'My new post',
  })
  @MinLength(10, { message: 'post should not be less than 10 characters' })
  @MaxLength(500, { message: 'post should not be more than 500 characters' })
  @IsNotEmpty({ message: 'post to create is required' })
  post: string;
}
