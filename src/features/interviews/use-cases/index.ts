import AddInterviewCase from './add-interview.case';
import ConfirmPaymentCase from './confirm-payment.case';
import FindInterviewsCase from './find-interviews.case';
import GetInterviewByIdCase from './get-interview-by-id.case';
import CheckInterviewTimeConflictCase from './check-interview-time-conflict.case';
import MarkInterviewAsDeployedCase from './mark-interview-as-deployed.case';
import TakePeerIdsCase from './take-peer-ids.case';

const interviewUseCases = [
  AddInterviewCase,
  ConfirmPaymentCase,
  CheckInterviewTimeConflictCase,
  MarkInterviewAsDeployedCase,
  TakePeerIdsCase,
  FindInterviewsCase,
  GetInterviewByIdCase,
];

export default interviewUseCases;
