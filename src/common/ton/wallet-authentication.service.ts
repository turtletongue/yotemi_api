import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Point, verify } from '@noble/ed25519';
import { catchError, firstValueFrom } from 'rxjs';
import { Buffer } from 'buffer';

import tonConfig from '@config/ton.config';
import { sha256 } from '@common/utils';
import { MS_IN_SECOND } from '@app/app.constants';
import {
  AccountIsNotInitializedException,
  SignatureExpiredException,
  InvalidAccountAddressException,
  NotAllowedDomainException,
} from './exceptions';

interface TonSignature {
  domain: {
    lengthBytes: number;
    value: string;
  };
  payload: string;
  signature: string;
  timestamp: bigint;
}

const TON_PROOF_PREFIX = Buffer.from('ton-proof-item-v2/', 'utf-8');
const TON_CONNECT_PREFIX = Buffer.from('ton-connect', 'utf-8');
const MESSAGE_PREFIX = Buffer.from([0xff, 0xff]);

@Injectable()
export default class WalletAuthenticationService {
  constructor(
    @Inject(tonConfig.KEY)
    private readonly config: ConfigType<typeof tonConfig>,
    private readonly http: HttpService,
  ) {}

  public async verifySignature(
    address: string,
    tonSignature: TonSignature,
  ): Promise<boolean> {
    const addressParts = address.split(':');

    if (addressParts.length !== 2) {
      throw new InvalidAccountAddressException();
    }

    if (
      BigInt(tonSignature.timestamp) + BigInt(this.config.signatureExpiresIn) <
      BigInt(Math.ceil(Date.now() / MS_IN_SECOND))
    ) {
      throw new SignatureExpiredException();
    }

    if (tonSignature.domain.value !== this.config.authDomain) {
      throw new NotAllowedDomainException();
    }

    const publicKey = await this.getPublicKey(address);

    // WorkChain is 32-bit integer
    const workChain = Buffer.alloc(4);
    workChain.writeInt32BE(+addressParts[0]);

    const addressHash = Buffer.from(addressParts[1], 'hex');

    // Domain length is 32-bit unsigned integer
    const domainLength = Buffer.alloc(4);
    domainLength.writeUint32LE(tonSignature.domain.lengthBytes);

    const domainName = Buffer.from(tonSignature.domain.value, 'utf-8');

    // Timestamp is 64-bit unsigned integer
    const timestamp = Buffer.alloc(8);
    timestamp.writeBigUint64LE(BigInt(tonSignature.timestamp));

    const payload = Buffer.from(tonSignature.payload, 'utf-8');

    const decodedSignature = Buffer.from(
      tonSignature.signature,
      'base64',
    ).toString('hex');

    const message = Buffer.concat([
      TON_PROOF_PREFIX,
      workChain,
      addressHash,
      domainLength,
      domainName,
      timestamp,
      payload,
    ]);

    return await verify(
      decodedSignature,
      sha256(
        Buffer.concat([
          MESSAGE_PREFIX,
          TON_CONNECT_PREFIX,
          Buffer.from(sha256(message), 'hex'),
        ]),
      ),
      publicKey,
    );
  }

  private async getPublicKey(address: string): Promise<Point> {
    const { data } = await firstValueFrom(
      this.http
        .get(`${this.config.url}/v1/wallet/getWalletPublicKey`, {
          params: {
            account: address,
          },
          headers: {
            Authorization: `Bearer ${this.config.apiJwt}`,
            'Accept-Encoding': 'gzip,deflate,compress',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.code === '400' || error.code === '500') {
              throw new AccountIsNotInitializedException();
            }

            throw error;
          }),
        ),
    );

    return Point.fromHex(data.publicKey);
  }
}
