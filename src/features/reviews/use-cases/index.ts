import AddReviewCase from './add-review.case';
import FindReviewsCase from './find-reviews.case';
import GetReviewByIdCase from './get-review-by-id.case';
import CheckReviewExistenceCase from './check-review-existence.case';

const reviewUseCases = [
  AddReviewCase,
  FindReviewsCase,
  GetReviewByIdCase,
  CheckReviewExistenceCase,
];

export default reviewUseCases;
