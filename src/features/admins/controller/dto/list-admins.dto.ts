import { PaginatedDto, PaginationParams } from '@common/pagination';
import GetAdminDto from './get-admin.dto';

export class ListAdminsParams extends PaginationParams {}

export default class ListAdminsDto extends PaginatedDto(GetAdminDto) {}
