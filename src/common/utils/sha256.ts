import { Buffer } from 'buffer';
import crypto from 'crypto';

const sha256 = (input: string | Buffer) =>
  crypto.createHash('sha256').update(input).digest('hex');

export default sha256;
