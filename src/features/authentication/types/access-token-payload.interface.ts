import { Id } from '@app/app.declarations';
import ExecutorKind from './executor-kind.type';

export default interface AccessTokenPayload {
  executorId: Id;
  kind: ExecutorKind;
}
