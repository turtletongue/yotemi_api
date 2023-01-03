import { Id } from '@app/app.declarations';
import ExecutorKind from './executor-kind.type';

export default interface RefreshTokenPayload {
  executorId: Id;
  kind: ExecutorKind;
  tokenId: string;
}
