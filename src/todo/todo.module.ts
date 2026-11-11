import { Module , NestModule, MiddlewareConsumer} from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { AuthUserMiddleware } from './middlewares/auth-user.middleware';
@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthUserMiddleware)
      .forRoutes(TodoController); // Applique le middleware uniquement sur TodoController 
      // Intercepte TOUTES les requêtes vers TodoController
  }
}
