import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { TODO_ERRORS } from '../errors/todo.errors';

export class CreateTodoDto {
  @IsNotEmpty({ message: TODO_ERRORS.NAME_REQUIRED })
  @IsString()
  @MinLength(3, { message: TODO_ERRORS.NAME_MIN_LENGTH })
  @MaxLength(10, { message: TODO_ERRORS.NAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: TODO_ERRORS.DESCRIPTION_REQUIRED })
  @IsString()
  @MinLength(10, { message: TODO_ERRORS.DESCRIPTION_MIN_LENGTH })
  description: string;
}