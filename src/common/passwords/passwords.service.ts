import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { HASH_SALT_ROUNDS } from './passwords.constants';

@Injectable()
export default class PasswordsService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, HASH_SALT_ROUNDS);
  }

  public async compare(hash: string, password: string): Promise<boolean> {
    return await bcrypt.compare(hash, password);
  }
}
