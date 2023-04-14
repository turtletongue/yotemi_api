import { Injectable } from '@nestjs/common';

import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import GetInterviewDto from './dto/get-interview.dto';
import ListInterviewsDto, {
  ListInterviewsParams,
} from './dto/list-interviews.dto';
import PostInterviewDto from './dto/post-interview.dto';
import PatchInterviewDto from './dto/patch-interview.dto';
import PostInterviewTimeCheckDto from './dto/post-interview-time-check.dto';
import FindInterviewsCase from '../use-cases/find-interviews.case';
import GetInterviewByIdCase from '../use-cases/get-interview-by-id.case';
import AddInterviewCase from '../use-cases/add-interview.case';
import ConfirmPaymentCase from '../use-cases/confirm-payment.case';
import CheckInterviewTimeConflictCase from '../use-cases/check-interview-time-conflict.case';
import TakeCreatorPeerIdCase from '../use-cases/take-creator-peer-id.case';
import TakeParticipantPeerIdCase from '../use-cases/take-participant-peer-id.case';

@Injectable()
export default class InterviewsService {
  constructor(
    private readonly findInterviewsCase: FindInterviewsCase,
    private readonly getInterviewByIdCase: GetInterviewByIdCase,
    private readonly addInterviewCase: AddInterviewCase,
    private readonly checkInterviewTimeConflictCase: CheckInterviewTimeConflictCase,
    private readonly confirmPaymentCase: ConfirmPaymentCase,
    private readonly takeCreatorPeerIdCase: TakeCreatorPeerIdCase,
    private readonly takeParticipantPeerIdCase: TakeParticipantPeerIdCase,
  ) {}

  public async getInterviewById(id: Id): Promise<GetInterviewDto> {
    return await this.getInterviewByIdCase.apply(id);
  }

  public async findInterviews(
    params: ListInterviewsParams,
  ): Promise<ListInterviewsDto> {
    const items = await this.findInterviewsCase.apply(params);

    return { items };
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

  public async takeCreatorPeerId(
    id: Id,
    executor: UserEntity,
  ): Promise<{ peerId: string }> {
    const peerId = await this.takeCreatorPeerIdCase.apply({ id, executor });

    return { peerId };
  }

  public async takeParticipantPeerId(
    id: Id,
    executor: UserEntity,
  ): Promise<{ peerId: string }> {
    const peerId = await this.takeParticipantPeerIdCase.apply({ id, executor });

    return { peerId };
  }
}
