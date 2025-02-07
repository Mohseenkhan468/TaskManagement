import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['user', 'admin'] })
  @IsIn(['user', 'admin'])
  role: string;
}

export class LoginDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateNewUserDto extends LoginDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  last_name?: string;
}

export class EditUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  last_name?: string;
}

export class UserIdParamDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsMongoId()
  user_id: string;
}

