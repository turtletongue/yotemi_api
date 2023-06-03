import { Injectable } from '@nestjs/common';

import { PasswordsService } from '@common/passwords';
import { IdentifiersService } from '@common/identifiers';
import BuildAdminDto from './dto/build-admin.dto';
import AdminEntity from './admin.entity';

@Injectable()
export default class AdminFactory {
  constructor(
    private readonly passwords: PasswordsService,
    private readonly identifiers: IdentifiersService,
  ) {}

  public async build({
    id = this.identifiers.generate(),
    username,
    password,
    passwordHash,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: BuildAdminDto): Promise<AdminEntity> {
    const compare = this.passwords.compare;

    const isPasswordsMatch = async function (
      this: AdminEntity,
      password: string,
    ): Promise<boolean> {
      const hashedPassword = this.hashedPassword;

      if (!hashedPassword) {
        return false;
      }

      return compare(hashedPassword, password);
    };

    return new AdminEntity(
      id,
      username,
      passwordHash ? passwordHash : await this.passwords.hash(password),
      createdAt,
      updatedAt,
      isPasswordsMatch,
    );
  }

  public async buildMany(admins: BuildAdminDto[]): Promise<AdminEntity[]> {
    return await Promise.all(
      admins.map(async (admin) => await this.build(admin)),
    );
  }
}
