import { Module } from '@nestjs/common';

import AdminsModule from '@features/admins';
import PasswordChangingController, {
  passwordChangingServices,
} from './controller';

@Module({
  imports: [AdminsModule],
  controllers: [PasswordChangingController],
  providers: [...passwordChangingServices],
})
export default class PasswordChangingModule {}
