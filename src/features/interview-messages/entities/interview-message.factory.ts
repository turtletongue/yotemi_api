import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';
import BuildInterviewMessageDto from './dto/build-interview-message.dto';
import InterviewMessageEntity from './interview-message.entity';

@Injectable()
export default class InterviewMessageFactory {
  constructor(private readonly identifiers: IdentifiersService) {}

  public async build({
    id = this.identifiers.generate(),
    content,
    authorId = null,
    interviewId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildInterviewMessageDto): Promise<InterviewMessageEntity> {
    return new InterviewMessageEntity(
      id,
      content,
      authorId,
      interviewId,
      createdAt,
      updatedAt,
    );
  }
}
