import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ConnectedUser } from '../interfaces/connected-user.interface';

// Récupère l'utilisateur rangé dans request.user par le guard d'authentification
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): ConnectedUser => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);