import { Injectable } from '@nestjs/common';

import { S3Service } from '@common/s3';
import { Id } from '@app/app.declarations';
import InterviewsRepository from '../interviews.repository';
import { PlainInterview } from '../entities';

@Injectable()
export default class GetInterviewByIdCase {
  constructor(
    private readonly interviewsRepository: InterviewsRepository,
    private readonly s3: S3Service,
  ) {}

  public async apply(id: Id): Promise<PlainInterview> {
    const { plain } = await this.interviewsRepository.findById(id);

    return {
      ...plain,
      creator: plain.creator && {
        ...plain.creator,
        avatarPath: plain.creator?.avatarPath
          ? this.s3.getReadPath(plain.creator.avatarPath)
          : null,
        coverPath: plain.creator?.coverPath
          ? this.s3.getReadPath(plain.creator.coverPath)
          : null,
      },
      participant: plain.participant && {
        ...plain.participant,
        avatarPath: plain.participant?.avatarPath
          ? this.s3.getReadPath(plain.participant.avatarPath)
          : null,
        coverPath: plain.participant?.coverPath
          ? this.s3.getReadPath(plain.participant.coverPath)
          : null,
      },
    };
  }
}
