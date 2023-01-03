import { Injectable } from '@nestjs/common';

import { PaginationResult } from '@common/pagination';
import FindAdminsDto from './dto/find-admins.dto';
import AdminsRepository from '../admins.repository';
import { PlainAdmin } from '../entities';

@Injectable()
export default class FindAdminsCase {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  public async apply(
    dto: FindAdminsDto,
  ): Promise<PaginationResult<Omit<PlainAdmin, 'password'>>> {
    const result = await this.adminsRepository.findPaginated(
      dto.page,
      dto.pageSize,
    );

    return {
      ...result,
      items: result.items.map((admin) => {
        const plain = admin.getPlain();

        return {
          id: plain.id,
          username: plain.username,
          createdAt: plain.createdAt,
          updatedAt: plain.updatedAt,
        };
      }),
    };
  }
}
