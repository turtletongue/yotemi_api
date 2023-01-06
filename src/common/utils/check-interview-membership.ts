import { UnauthorizedException } from '@nestjs/common';

import InterviewsRepository from '@features/interviews/interviews.repository';
import { UserEntity } from '@features/users/entities';
import { Id } from '@app/app.declarations';

const checkInterviewMembership = async (
  interviewsRepository: InterviewsRepository,
  interviewId: Id,
  executor: UserEntity,
) => {
  const interview = await interviewsRepository.findById(interviewId);

  const interviewMemberIds = [interview.creatorId];

  if (interview.participant !== null) {
    interviewMemberIds.push(interview.participant.id);
  }

  if (!interviewMemberIds.includes(executor.id)) {
    throw new UnauthorizedException();
  }

  return interview;
};

export default checkInterviewMembership;
