import { ParseFilePipeBuilder } from '@nestjs/common';

export const PASSWORD_MIN_LENGTH = 8;

export const MS_IN_SECOND = 1000;

export const MS_IN_MINUTE = MS_IN_SECOND * 60;

export const MS_IN_HOUR = MS_IN_MINUTE * 60;

export const MS_IN_DAY = MS_IN_HOUR * 24;

export const BYTES_IN_MB = 1024 * 1024;

export const imagesValidationPipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: 10 * BYTES_IN_MB,
  })
  .addFileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)/ })
  .build();
