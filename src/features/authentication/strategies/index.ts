import AccessJwtStrategy from './access-jwt.strategy';
import RefreshAdminJwtStrategy from './refresh-admin-jwt.strategy';
import RefreshUserJwtStrategy from './refresh-user-jwt.strategy';

const authenticationStrategies = [
  AccessJwtStrategy,
  RefreshUserJwtStrategy,
  RefreshAdminJwtStrategy,
];

export default authenticationStrategies;
