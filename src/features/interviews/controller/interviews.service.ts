import { Injectable } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { AdminEntity } from '@features/admins/entities';
import { Id } from '@app/app.declarations';
import GetInterviewDto from './dto/get-interview.dto';
import ListInterviewsDto, {
  ListInterviewsParams,
} from './dto/list-interviews.dto';
import PostInterviewDto from './dto/post-interview.dto';
import PatchInterviewDto from './dto/patch-interview.dto';
import PostInterviewTimeCheckDto from './dto/post-interview-time-check.dto';
import PostPeerIdsDto from './dto/post-peer-ids.dto';
import FindInterviewsCase from '../use-cases/find-interviews.case';
import GetInterviewByIdCase from '../use-cases/get-interview-by-id.case';
import AddInterviewCase from '../use-cases/add-interview.case';
import ConfirmPaymentCase from '../use-cases/confirm-payment.case';
import CheckInterviewTimeConflictCase from '../use-cases/check-interview-time-conflict.case';
import MarkInterviewAsDeployedCase from '../use-cases/mark-interview-as-deployed.case';
import TakePeerIdsCase from '../use-cases/take-peer-ids.case';

@Injectable()
export default class InterviewsService {
  constructor(
    private readonly findInterviewsCase: FindInterviewsCase,
    private readonly getInterviewByIdCase: GetInterviewByIdCase,
    private readonly addInterviewCase: AddInterviewCase,
    private readonly checkInterviewTimeConflictCase: CheckInterviewTimeConflictCase,
    private readonly confirmPaymentCase: ConfirmPaymentCase,
    private readonly markInterviewAsDeployedCase: MarkInterviewAsDeployedCase,
    private readonly takePeerIdsCase: TakePeerIdsCase,
  ) {}

  public async getInterviewById(id: Id): Promise<GetInterviewDto> {
    return await this.getInterviewByIdCase.apply(id);
  }

  public async findInterviews(
    params: ListInterviewsParams,
    executor?: AdminEntity | UserEntity,
  ): Promise<ListInterviewsDto> {
    const result = await this.findInterviewsCase.apply({ ...params, executor });

    return 'items' in result ? result : { items: result };
  }

  public async addInterview(
    dto: PostInterviewDto,
    executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.addInterviewCase.apply({ ...dto, executor });
  }

  public async checkInterviewTimeConflict(
    dto: PostInterviewTimeCheckDto,
    executor: UserEntity,
  ): Promise<void> {
    return await this.checkInterviewTimeConflictCase.apply({
      ...dto,
      executor,
    });
  }

  public async confirmPayment(
    id: Id,
    dto: PatchInterviewDto,
    executor: UserEntity,
  ): Promise<GetInterviewDto> {
    return await this.confirmPaymentCase.apply({ ...dto, id, executor });
  }

  public async markAsDeployed(id: Id, executor: UserEntity): Promise<void> {
    return await this.markInterviewAsDeployedCase.apply({ id, executor });
  }

  public async takePeerIds(
    id: Id,
    executor: UserEntity,
  ): Promise<PostPeerIdsDto> {
    return await this.takePeerIdsCase.apply({ id, executor });
  }
}
