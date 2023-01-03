import { Id } from '@app/app.declarations';
import ExecutorKind from './executor-kind.type';

export default interface RefreshTokenRecord {
  id: string;
  kind: ExecutorKind;
  executorId: Id;
  expiresAt: string;
  createdAt: string;
}
