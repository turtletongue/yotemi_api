import AddInterviewCase from './add-interview.case';
import ConfirmPaymentCase from './confirm-payment.case';
import FindInterviewsCase from './find-interviews.case';
import GetInterviewByIdCase from './get-interview-by-id.case';
import CheckInterviewTimeConflictCase from './check-interview-time-conflict.case';
import TakePeerIdsCase from './take-peer-ids.case';
import TakeParticipantPeerIdCase from './take-participant-peer-id.case';

const interviewUseCases = [
  AddInterviewCase,
  ConfirmPaymentCase,
  CheckInterviewTimeConflictCase,
  TakePeerIdsCase,
  TakeParticipantPeerIdCase,
  FindInterviewsCase,
  GetInterviewByIdCase,
];

export default interviewUseCases;
