import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const auth: string = request.headers.authorization;

      if (!auth) {
        throw new UnauthorizedException('Bearer JWT must be provided');
      }

      const token: string = auth.replace('Bearer ', '');

      if (!token) {
        throw new UnauthorizedException('JWT must be provided');
      }

      request.user = await this.firebaseService.auth().verifyIdToken(token);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
