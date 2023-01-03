import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export default class IdentifiersService {
  public generate(): string {
    return uuid();
  }
}
