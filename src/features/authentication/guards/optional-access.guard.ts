import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export default class AccessGuard extends AuthGuard('access') {
  handleRequest(err: Error, user: any, info: Error) {
    if (
      info instanceof TokenExpiredError ||
      info instanceof JsonWebTokenError
    ) {
      throw new UnauthorizedException();
    }

    return user || null;
  }
}
