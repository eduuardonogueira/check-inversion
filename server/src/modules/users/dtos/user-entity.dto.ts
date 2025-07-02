import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserEntity {
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  username: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @MaxLength(100)
  @IsString()
  password?: string;

  @MaxLength(20)
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => ('' + value).toUpperCase())
  @IsEnum(UserRole)
  role: 'USER' | 'ADMIN';

  @IsOptional()
  @IsString()
  phone?: string;
}
