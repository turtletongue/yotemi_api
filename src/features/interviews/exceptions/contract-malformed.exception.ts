import { UnprocessableEntityException } from '@nestjs/common';

export default class ContractMalformedException extends UnprocessableEntityException {
  constructor() {
    super('Contract code is malformed', {
      description: 'CONTRACT_MALFORMED',
    });
  }
}
