import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface ApiConfig {
  environment: 'development' | 'production';
  port: number;
}

const schema = Joi.object({
  environment: Joi.string().valid('development', 'production').required(),
  port: Joi.number().required().default(3030),
});

export default registerAs<ApiConfig>('api', () => {
  const config = {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
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
