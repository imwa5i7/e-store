import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  lastName!: string;
}
