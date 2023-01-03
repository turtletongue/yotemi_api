import { Module } from '@nestjs/common';

import PrismaModule from '@common/prisma';
import IdentifiersModule from '@common/identifiers';
import PaginationModule from '@common/pagination';
import UsersRepository from './users.repository';
import { UserFactory } from './entities';
import userUseCases from './use-cases';
import AdminsController, { userServices } from './controller';

@Module({
  imports: [IdentifiersModule, PaginationModule, PrismaModule],
  controllers: [AdminsController],
  providers: [UserFactory, UsersRepository, ...userUseCases, ...userServices],
  exports: [...userUseCases, UsersRepository],
})
export default class UsersModule {}
