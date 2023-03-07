import Joi from 'joi';
import { registerAs } from '@nestjs/config';

export interface S3Config {
  keyId: string;
  secretKey: string;
  bucket: string;
  readUrl: string;
}

const schema = Joi.object({
  keyId: Joi.string().required(),
  secretKey: Joi.string().required(),
  bucket: Joi.string().required(),
  readUrl: Joi.string().required(),
});

export default registerAs<S3Config>('s3', () => {
  const config = {
    keyId: process.env.S3_KEY_ID,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
    readUrl: process.env.S3_READ_URL,
  };

  const validationResult = schema.validate(config, {
    abortEarly: true,
    allowUnknown: false,
    convert: true,
  });

  if (validationResult.error) {
    throw validationResult.error;
  }

  return validationResult.value;
});
