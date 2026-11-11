import {  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Version, 
Delete,
Get,Query,ParseEnumPipe,Req, 
  UnauthorizedException, 
  NotFoundException, 
  UseGuards} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { StatusEnum } from './enums/status.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Version('1')
  @Post()
  addTodo(@Body() dto: CreateTodoDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.todoService.addTodo(dto, userId);
  }

  @Version('2')
  @Post()
  addTodoV2(@Body() dto: CreateTodoDto, @Req() req: Request) {
    const userId = (req as any).user.userId;
    return this.todoService.addTodoV2(dto, userId);
  }

  @Patch(':id')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTodoDto,
    @Req() req: Request,
  ) {
    const currentUserId = (req as any).user.userId;

    // 1. Récupération du Todo existant
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo avec l'ID ${id} introuvable`);
    }

    // 2. Vérification de la propriété
    if (todo.userId !== currentUserId) {
      throw new UnauthorizedException(
        'Seul le créateur de ce Todo est autorisé à le modifier',
      );
    }

    return this.todoService.updateTodo(id, dto);
  }

  @Patch(':id/restore')
  async restoreTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUserId = (req as any).user.userId;
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo avec l'ID ${id} introuvable`);
    }

    if (todo.userId !== currentUserId) {
      throw new UnauthorizedException(
        'Seul le créateur de ce Todo est autorisé à le restaurer',
      );
    }

    return this.todoService.restoreTodo(id);
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUserId = (req as any).user.userId;
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo avec l'ID ${id} introuvable`);
    }

    if (todo.userId !== currentUserId) {
      throw new UnauthorizedException(
        'Seul le créateur de ce Todo est autorisé à le supprimer',
      );
    }

    return this.todoService.deleteTodo(id);
  }

  @Delete(':id/soft')
  async SoftDeleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const currentUserId = (req as any).user.userId;
    const todo = await this.todoService.findOne(id);
    if (!todo) {
      throw new NotFoundException(`Todo avec l'ID ${id} introuvable`);
    }

    if (todo.userId !== currentUserId) {
      throw new UnauthorizedException(
        'Seul le créateur de ce Todo est autorisé à le supprimer',
      );
    }

    return this.todoService.SoftDeleteTodo(id);
  }

@Get('stats/count')
@UseGuards(RolesGuard)
@Roles('admin')
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