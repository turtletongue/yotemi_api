import AccessJwtStrategy from './access-jwt.strategy';
import RefreshJwtStrategy from './refresh-jwt.strategy';

const authenticationStrategies = [AccessJwtStrategy, RefreshJwtStrategy];

export default authenticationStrategies;
