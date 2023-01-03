import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import PasswordsModule from '@common/passwords';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import AdminsRepository from './admins.repository';
import { AdminFactory } from './entities';
import adminUseCases from './use-cases';
import AdminsController, { adminServices } from './controller';

@Module({
  imports: [PasswordsModule, IdentifiersModule, PaginationModule, PrismaModule],
  controllers: [AdminsController],
  providers: [
    AdminFactory,
    AdminsRepository,
    ...adminUseCases,
    ...adminServices,
  ],
  exports: [...adminUseCases, AdminsRepository],
})
export default class AdminsModule {}
