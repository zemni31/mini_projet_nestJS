import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupération des rôles définis sur la route ou la classe via le décorateur @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si aucun rôle n'est spécifié sur la route, l'accès est libre
    if (!requiredRoles) {
      return true;
    }

    // 3. Récupération de l'utilisateur injecté par le middleware dans l'objet Request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 4. Vérification dynamique : le rôle du user est-il inclus dans les rôles autorisés ?
    return user && user.role && requiredRoles.includes(user.role);
  }
}