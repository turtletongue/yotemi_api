import { Injectable } from '@nestjs/common';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  toNano,
  TonClient,
} from 'ton';
import { readFileSync } from 'fs';
import path from 'path';

import InterviewContract, { InterviewInfo } from '@contract/interview-contract';
import { PlainInterview } from '@features/interviews/entities';

const code = Cell.fromBoc(
  readFileSync(
    path.resolve(__dirname, '..', '..', 'contract', 'interview.cell'),
  ),
)[0];

@Injectable()
export default class InterviewContractService {
  public async isCodeMalformed(
    address: string,
    interview: PlainInterview,
    creatorAddress: string,
  ): Promise<boolean> {
    const creator = Address.parse(creatorAddress);
    const data = beginCell()
      .storeUint(toNano(interview.price.toString()), 64)
      .storeAddress(creator)
      .storeAddress(creator)
      .storeUint(Math.floor(interview.startAt.getTime() / 1000), 32)
      .storeUint(Math.floor(interview.endAt.getTime() / 1000), 32)
      .storeUint(1, 3)
      .endCell();

    const actualAddress = contractAddress(0, { code, data });

    return !Address.parse(address).equals(actualAddress);
  }

  public async isDeployed(address: string): Promise<boolean> {
    const endpoint = await getHttpEndpoint({ network: 'mainnet' });
    const client = new TonClient({ endpoint });

    const parsedAddress = Address.parse(address);

    return await client.isContractDeployed(parsedAddress);
  }

  public async getInfo(address: string): Promise<InterviewInfo | null> {
    const endpoint = await getHttpEndpoint({ network: 'mainnet' });
    const client = new TonClient({ endpoint });

    const parsedAddress = Address.parse(address);
    const contract = new InterviewContract(parsedAddress);

    const openedContract = client.open(contract);

    try {
      return await openedContract.getInfo();
    } catch (error: unknown) {
      return null;
    }
  }
}
