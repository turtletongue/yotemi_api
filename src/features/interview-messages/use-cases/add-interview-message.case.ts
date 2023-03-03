import { Injectable } from '@nestjs/common';

import { checkInterviewMembership } from '@common/utils';
import InterviewsRepository from '@features/interviews/interviews.repository';
import AddInterviewMessageDto from './dto/add-interview-message.dto';
import InterviewMessagesRepository from '../interview-messages.repository';
import { InterviewMessageFactory, PlainInterviewMessage } from '../entities';
import { InvalidMessagesInterviewStatusException } from '../exceptions';

@Injectable()
export default class AddInterviewMessageCase {
  constructor(
    private readonly interviewMessagesRepository: InterviewMessagesRepository,
    private readonly interviewsRepository: InterviewsRepository,
    private readonly interviewMessageFactory: InterviewMessageFactory,
  ) {}

  public async apply(
    dto: AddInterviewMessageDto,
  ): Promise<PlainInterviewMessage> {
    const interview = await checkInterviewMembership(
      this.interviewsRepository,
      dto.interviewId,
      dto.executor,
    );

    if (interview.status !== 'paid') {
      throw new InvalidMessagesInterviewStatusException();
    }

    const interviewMessage = await this.interviewMessageFactory.build({
      ...dto,
      authorId: dto.executor.id,
    });

    const { plain } = await this.interviewMessagesRepository.create(
      interviewMessage.plain,
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
