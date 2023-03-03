import { Address, Contract, ContractProvider, fromNano } from 'ton-core';

import unixToDate from '@common/utils/unix-to-date';
import { InterviewStatus } from '@features/interviews/interviews.types';

export type InterviewInfo = {
  price: number;
  creatorAddress: string;
  payerAddress: string;
  startAt: Date;
  endAt: Date;
  status: InterviewStatus;
};

enum Status {
  created = 1,
  paid = 2,
  canceled = 3,
  finished = 4,
}

export default class InterviewContract implements Contract {
  constructor(readonly address: Address) {}

  async getInfo(provider: ContractProvider): Promise<InterviewInfo> {
    const { stack } = await provider.get('info', []);

    return {
      price: +fromNano(stack.readBigNumber()),
      creatorAddress: stack.readAddress().toString(),
      payerAddress: stack.readAddress().toString(),
      startAt: unixToDate(stack.readNumber()),
      endAt: unixToDate(stack.readNumber()),
      status: (
        {
          [Status.created]: 'created',
          [Status.paid]: 'paid',
          [Status.canceled]: 'canceled',
          [Status.finished]: 'finished',
        } as const
      )[stack.readNumber()],
    };
  }
}
