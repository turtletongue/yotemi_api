import { Injectable } from '@nestjs/common';

import { IdentifiersService } from '@common/identifiers';

@Injectable()
export default class PeersService {
  constructor(private readonly identifiers: IdentifiersService) {}

  public getId(): string {
    return this.identifiers.generate();
  }
}
