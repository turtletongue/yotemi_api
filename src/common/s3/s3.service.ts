import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import EasyYandexS3 from 'easy-yandex-s3';

import s3Config from '@config/s3.config';

@Injectable()
export default class S3Service {
  private readonly s3: EasyYandexS3;

  constructor(
    @Inject(s3Config.KEY) private readonly config: ConfigType<typeof s3Config>,
  ) {
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: config.keyId,
        secretAccessKey: config.secretKey,
      },
      Bucket: config.bucket,
    });
  }

  public async remove(path: string): Promise<void> {
    const isOk = await this.s3.Remove(path);

    if (!isOk) {
      throw new InternalServerErrorException('File deleting failed.');
    }
  }

  public getReadPath(path: string): string {
    return this.config.readUrl + path;
  }
}
