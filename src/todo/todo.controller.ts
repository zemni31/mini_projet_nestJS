import {  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Version, 
Delete,
Get,Query,ParseEnumPipe} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './enums/status.enum';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Version('1')
  @Post()
  addTodo(@Body() dto: CreateTodoDto) {
    return this.todoService.addTodo(dto);
  }

  @Version('2')
  @Post()
  addTodoV2(@Body() dto: CreateTodoDto) {
    return this.todoService.addTodoV2(dto);
  }

   @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(id, dto);
  }

   @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteTodo(id);
  }

   @Delete(':id/soft')
  SoftDeleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.SoftDeleteTodo(id);
  }

 
  @Patch(':id/restore')
  restoreTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.restoreTodo(id);
}

@Get('stats/count')
countTodosByStatus() {
  return this.todoService.countTodosByStatus();
}
@Version('1')//pagination par page et limit optiionnelle
@Get()
findAll(
  @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
) {
  return this.todoService.findAll(page, limit);
}

@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.todoService.findOne(id);
}
@Version('2') //avec recherche par nom et filtre par statut
@Get()
findBy(
  @Query('search') search?: string,
  @Query('status', new ParseEnumPipe(StatusEnum, { optional: true }))
  status?: StatusEnum,
) {
  return this.todoService.findBy(search, status);
}

}