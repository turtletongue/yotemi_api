import { BadRequestException } from '@nestjs/common';

import { MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER } from '../interviews.constants';

export default class InterviewsTimeFilterTooWideException extends BadRequestException {
  constructor() {
    super(
      `Please, make sure what difference between "from" and "to" dates is less than or equal to ${MAX_DAYS_DIFF_FOR_FIND_INTERVIEWS_FILTER} days`,
      {
        description: 'INTERVIEWS_TIME_FILTER_TOO_WIDE',
      },
    );
  }
}
