import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface TonConfig {
  url: string;
  apiJwt: string;
  authDomain: string;
  signatureExpiresIn: number;
}

const schema = Joi.object({
  url: Joi.string().required(),
  apiJwt: Joi.string().required(),
  authDomain: Joi.string().required(),
  signatureExpiresIn: Joi.number().integer().required(),
});

export default registerAs<TonConfig>('ton', () => {
  const config = {
    url: process.env.TON_API_URL,
    apiJwt: process.env.TON_API_JWT,
    authDomain: process.env.TON_ALLOWED_AUTH_DOMAIN,
    signatureExpiresIn: process.env.TON_SIGNATURE_EXPIRES_IN,
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
