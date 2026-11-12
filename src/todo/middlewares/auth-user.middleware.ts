import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 1. Vérification de l'existence du header 'auth-user'
    const token = req.headers['auth-user'] as string;

    if (!token) {
      return res.status(401).json({ 
        message: 'Accès refusé : Le header auth-user est absent' 
      });
    }

    try {
      // 2. Décodage et vérification du token JWT
      const secretKey =process.env.JWT_SECRET || 'secretKey'; // Clé de signature
      const decoded = verify(token, secretKey) as { userId: number | string; username?: string; role?: string };
      // 3. Vérification de la présence de la propriété userId
      if (!decoded || !decoded.userId) {
        return res.status(403).json({ 
          message: 'Accès refusé : Le token ne contient pas de userId' 
        });
      }

      // 4. Injection dans l'objet request
      req['user'] = decoded;

      // 5. Passage au middleware ou contrôleur suivant
      next();
    } catch (error  : any) {
      // Si le token est corrompu ou expiré
      throw new UnauthorizedException('Accès refusé : Token invalide ou expiré ');

  }
}}