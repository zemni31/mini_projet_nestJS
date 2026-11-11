import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { AUTH_ERRORS } from '../errors/auth.errors';

export class InscriptionDto {
  @IsNotEmpty({ message: AUTH_ERRORS.USERNAME_REQUIRED })
  @IsString()
  @MinLength(3, { message: AUTH_ERRORS.USERNAME_MIN_LENGTH })
  @MaxLength(20, { message: AUTH_ERRORS.USERNAME_MAX_LENGTH })
  username: string;

  @IsNotEmpty({ message: AUTH_ERRORS.PASSWORD_REQUIRED })
  @IsString()
  @MinLength(8, { message: AUTH_ERRORS.PASSWORD_MIN_LENGTH })
  password: string;

  @IsNotEmpty({ message: AUTH_ERRORS.EMAIL_REQUIRED })
  @IsEmail({}, { message: AUTH_ERRORS.EMAIL_INVALID })
  email: string;
}