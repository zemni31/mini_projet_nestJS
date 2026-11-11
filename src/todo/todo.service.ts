import { Injectable, NotFoundException,BadRequestException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TODO_ERRORS } from './errors/todo.errors';
import { StatusEnum } from './enums/status.enum';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // Version 1 : avec le repository (méthode usuelle)
  async addTodo(dto: CreateTodoDto, userId: number) {
  // On étale les champs de dto (name, description, etc.) et on ajoute userId
  const newTodo = this.todoRepository.create({
    ...dto,
    userId,
  });

  return await this.todoRepository.save(newTodo);
}

async addTodoV2(dto: CreateTodoDto, userId: number) {
  const newTodo = this.todoRepository.create({
    ...dto,
    userId,
  });

  return await this.todoRepository.save(newTodo);
}

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(TODO_ERRORS.NOT_FOUND);
    }
    const updated = this.todoRepository.merge(todo, dto);
    return this.todoRepository.save(updated);
  }
// Suppression définitive
   async deleteTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(TODO_ERRORS.NOT_FOUND);
    }
     await this.todoRepository.remove(todo);
}
    async SoftDeleteTodo(id: number): Promise<void> {
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(TODO_ERRORS.NOT_FOUND);
    }
     await this.todoRepository.softRemove(todo);}

     
     
     async restoreTodo(id: number): Promise<TodoEntity> {
     const todo = await this.todoRepository.findOne({
    where: { id },
    withDeleted: true,
  });
  if (!todo) {
    throw new NotFoundException(TODO_ERRORS.NOT_FOUND);
  }
  if (!todo.deletedAt) {
    throw new BadRequestException(TODO_ERRORS.NOT_DELETED);
  }
  return this.todoRepository.recover(todo);
}


async countTodosByStatus(): Promise<Record<StatusEnum, number>> {
  const rows = await this.todoRepository
    .createQueryBuilder('todo')
    .select('todo.status', 'status')
    .addSelect('COUNT(todo.id)', 'count')
    .groupBy('todo.status')
    .getRawMany<{ status: StatusEnum; count: string }>();

  // Initialise les trois statuts à 0, pour qu'un statut sans todo apparaisse quand même dans le résultat
  const result: Record<StatusEnum, number> = {
    [StatusEnum.TODO]: 0,
    [StatusEnum.IN_PROGRESS]: 0,
    [StatusEnum.DONE]: 0,
  };

  for (const row of rows) {
    result[row.status] = Number(row.count);
  }

  return result;
}

async findAll(
  page?: number,
  limit?: number,
): Promise<TodoEntity[] | { data: TodoEntity[]; total: number; page: number; limit: number }> {
  if (page === undefined && limit === undefined) {
    return this.todoRepository.find({
      order: { id: 'ASC' },
    });
  }

  if (page === undefined || limit === undefined || page < 1 || limit < 1) {
    throw new BadRequestException('page et limit doivent être fournis et supérieurs à 0');
  }

  const [data, total] = await this.todoRepository.findAndCount({
    order: { id: 'ASC' },
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data, total, page, limit };
}

async findOne(id: number): Promise<TodoEntity> {
  const todo = await this.todoRepository.findOneBy({ id });
  if (!todo) {
    throw new NotFoundException(TODO_ERRORS.NOT_FOUND);
  }
  return todo;
}

async findBy(search?: string, status?: StatusEnum): Promise<TodoEntity[]> {
  const qb = this.todoRepository
    .createQueryBuilder('todo')
    .orderBy('todo.id', 'ASC');

  if (search) {
    qb.andWhere(
      '(todo.name ILIKE :search OR todo.description ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  if (status) {
    qb.andWhere('todo.status = :status', { status });
  }

  return qb.getMany();// renvoie tous les todos correspondants sous forme d’un tableau de TodoEntity
}

}