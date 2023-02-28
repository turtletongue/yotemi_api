import UsersService from './users.service';
import FollowingsService from './followings.service';

export const userServices = [UsersService, FollowingsService];

export { default as FollowingsController } from './followings.controller';

export { default } from './users.controller';
