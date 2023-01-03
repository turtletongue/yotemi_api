import AuthenticationService from './authentication.service';
import RefreshTokensService from './refresh-tokens.service';

export const authenticationServices = [
  AuthenticationService,
  RefreshTokensService,
];

export { default } from './authentication.controller';
