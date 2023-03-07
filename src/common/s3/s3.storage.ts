import { InternalServerErrorException } from '@nestjs/common';

import { StorageEngine } from 'multer';
import EasyYandexS3 from 'easy-yandex-s3';
import { buffer } from 'stream/consumers';
import { extname } from 'path';

type YandexCloudBlobReference = {
  destination: string;
  filename: string;
  mimetype: string;
};

export type FileInfo = {
  filename: string;
  originalname: string;
  mimetype: string;
  bucket: string;
  destination: string;
  size: number;
  path: string;
};

export type S3StorageOptions = {
  keyId: string;
  secretKey: string;
  bucket: string;
  destination: string;
};

export default class S3Storage implements StorageEngine {
  private readonly s3: EasyYandexS3;

  constructor(private readonly options: S3StorageOptions) {
    this.s3 = new EasyYandexS3({
      auth: {
        accessKeyId: options.keyId,
        secretAccessKey: options.secretKey,
      },
      Bucket: options.bucket,
    });
  }

  public getDestination(
    req: any,
    file: any,
    cb: (error: Error, destination: string) => unknown,
  ): void {
    cb(null, this.options.destination);
  }

  public getFileName(
    req: any,
    file: any,
    cb: (error: Error, fileName: string) => unknown,
  ): void {
    if (typeof file.originalname === 'string') {
      file.originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );

      cb(null, Date.now() + extname(file.originalname));
    } else {
      cb(null, Date.now().toString());
    }
  }

  public getContentType(
    req: any,
    file: any,
    cb: (error: Error, mimetype: string) => unknown,
  ): void {
    if (typeof file.mimetype === 'string') {
      cb(null, file.mimetype);
    } else {
      cb(null, 'application/octet-stream');
    }
  }

  private getBlobFileReference(
    req: any,
    file: any,
  ): YandexCloudBlobReference | null {
    const blobFile = {
      destination: '',
      filename: '',
      mimetype: '',
    };

    this.getFileName(req, file, (error, fileName) => {
      if (error) {
        return null;
      }

      blobFile.filename = fileName;
    });

    this.getDestination(req, file, (error, destination) => {
      if (error) {
        return null;
      }

      blobFile.destination = destination;
    });

    this.getContentType(req, file, (error, mimetype) => {
      if (error) {
        return null;
      }

      blobFile.mimetype = mimetype;
    });

    return blobFile;
  }

  _handleFile(
    req: any,
    file: any,
    cb: (error: Error, fileInfo: FileInfo | undefined) => unknown,
  ): void {
    const blobFile = this.getBlobFileReference(req, file);

    if (!blobFile) {
      return;
    }

    buffer(file.stream)
      .then(async (fileBuffer) => {
        const isOk = await this.s3.Upload(
          {
            buffer: fileBuffer,
            name: blobFile.filename,
            save_name: true,
          },
          blobFile.destination,
        );

        if (!isOk) {
          throw new InternalServerErrorException('File uploading failed.');
        }

        return Buffer.byteLength(fileBuffer);
      })
      .then((writtenBytesLength) => {
        cb(null, {
          filename: blobFile.filename,
          originalname: file.originalname,
          mimetype: blobFile.mimetype,
          destination: blobFile.destination,
          size: writtenBytesLength,
          bucket: this.options.bucket,
          path: `${blobFile.destination}/${blobFile.filename}`,
        });
      })
      .catch((error) => cb(error, undefined));
  }

  _removeFile(
    req: any,
    file: any,
    cb: (error: Error | undefined) => unknown,
  ): void {
    this.s3
      .Remove(file.path)
      .then((isOk) => {
        if (!isOk) {
          throw new InternalServerErrorException('File deleting failed.');
        }

        cb(undefined);
      })
      .catch((error) => cb(error));
  }
}
