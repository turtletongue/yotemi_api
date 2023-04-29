import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class RefreshUserGuard extends AuthGuard('refresh-user') {}
