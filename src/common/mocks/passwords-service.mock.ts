import { PasswordsService } from '@common/passwords';

const PasswordsServiceMock: PasswordsService = {
  hash: jest.fn(),
  compare: jest.fn(),
};

export default PasswordsServiceMock;
