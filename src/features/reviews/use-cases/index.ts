import AddReviewCase from './add-review.case';
import FindReviewsCase from './find-reviews.case';
import GetReviewByIdCase from './get-review-by-id.case';
import CheckReviewExistenceCase from './check-review-existence.case';
import ModerateReviewCase from './moderate-review.case';

const reviewUseCases = [
  AddReviewCase,
  ModerateReviewCase,
  FindReviewsCase,
  GetReviewByIdCase,
  CheckReviewExistenceCase,
];

export default reviewUseCases;
