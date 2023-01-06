import { Injectable } from '@nestjs/common';

import { checkInterviewMembership } from '@common/utils';
import InterviewsRepository from '@features/interviews/interviews.repository';
import FindInterviewMessagesDto from './dto/find-interview-messages.dto';
import InterviewMessagesRepository from '../interview-messages.repository';
import { PlainInterviewMessage } from '../entities';

@Injectable()
export default class FindInterviewMessagesCase {
  constructor(
    private readonly interviewMessagesRepository: InterviewMessagesRepository,
    private readonly interviewsRepository: InterviewsRepository,
  ) {}

  public async apply(
    dto: FindInterviewMessagesDto,
  ): Promise<PlainInterviewMessage[]> {
    await checkInterviewMembership(
      this.interviewsRepository,
      dto.interviewId,
      dto.executor,
    );

    const interviewMessages = await this.interviewMessagesRepository.findAll({
      where: {
        interviewId: dto.interviewId,
      },
    });

    return interviewMessages.map(({ plain }) => ({
      id: plain.id,
      content: plain.content,
      authorId: plain.authorId,
      interviewId: plain.interviewId,
      createdAt: plain.createdAt,
      updatedAt: plain.updatedAt,
    }));
  }
}
