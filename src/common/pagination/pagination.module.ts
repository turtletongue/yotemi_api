import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import PaginationService from './pagination.service';

@Module({
  imports: [PrismaModule],
  providers: [PaginationService],
  exports: [PaginationService],
})
export default class PaginationModule {}
