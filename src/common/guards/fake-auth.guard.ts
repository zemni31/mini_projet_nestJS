import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

// TEMPORAIRE : simule le JwtAuthGuard du lot 4.
// À remplacer par le JwtAuthGuard dans cv.controller.ts, puis à supprimer avant la fusion.
@Injectable()
export class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = Number(request.headers['x-user-id']);
    if (!userId) {
      throw new UnauthorizedException('Vous devez être connecté.');
    }
    request.user = {
      userId,
      username: 'test',
      role: request.headers['x-user-role'] ?? 'user',
    };
    return true;
  }
}