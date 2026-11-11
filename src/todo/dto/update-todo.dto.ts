import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';
import { StatusEnum } from '../enums/status.enum';
import { TODO_ERRORS } from '../errors/todo.errors';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsOptional()
  @IsEnum(StatusEnum, { message: TODO_ERRORS.STATUS_INVALID })
  status?: StatusEnum;
}