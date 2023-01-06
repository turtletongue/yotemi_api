import { Injectable } from '@nestjs/common';

import { checkInterviewMembership } from '@common/utils';
import InterviewsRepository from '@features/interviews/interviews.repository';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';
import InterviewMessagesRepository from '../interview-messages.repository';
import { PlainInterviewMessage } from '../entities';

@Injectable()
export default class GetInterviewMessageByIdCase {
  constructor(
    private readonly interviewMessagesRepository: InterviewMessagesRepository,
    private readonly interviewsRepository: InterviewsRepository,
  ) {}

  public async apply(
    id: Id,
    executor: UserEntity,
  ): Promise<PlainInterviewMessage> {
    const { interviewId, plain } =
      await this.interviewMessagesRepository.findById(id);

    await checkInterviewMembership(
      this.interviewsRepository,
      interviewId,
      executor,
    );

    return {
      id: plain.id,
      content: plain.content,
      authorId: plain.authorId,
      interviewId: plain.interviewId,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    };
  }
}
