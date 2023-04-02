import { Injectable } from '@nestjs/common';

import CheckInterviewTimeConflictDto from './dto/check-interview-time-conflict.dto';
import InterviewsRepository from '../interviews.repository';
import {
  InterviewHasTimeConflictException,
  InterviewInPastException,
  InvalidInterviewEndDateException,
} from '../exceptions';

@Injectable()
export default class CheckInterviewTimeConflictCase {
  constructor(private readonly interviewsRepository: InterviewsRepository) {}

  public async apply(dto: CheckInterviewTimeConflictDto): Promise<void> {
    if (dto.startAt < new Date()) {
      throw new InterviewInPastException();
    }

    if (dto.endAt <= dto.startAt) {
      throw new InvalidInterviewEndDateException();
    }

    const hasConflict = await this.interviewsRepository.hasTimeConflict(
      dto.startAt,
      dto.endAt,
      dto.executor.id,
    );

    if (hasConflict) {
      throw new InterviewHasTimeConflictException();
    }
  }
}
