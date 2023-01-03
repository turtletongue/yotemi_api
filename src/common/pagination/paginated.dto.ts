import { ApiProperty } from '@nestjs/swagger';

import { ClassType } from '@app/app.declarations';

export default function PaginatedDto<T extends Record<string, any>>(
  ResourceClass: T,
) {
  class PaginatedClass {
    /**
     * Page number.
     * @example 1
     */
    public page: number;

    /**
     * Current page size.
     * @example 10
     */
    public pageSize: number;

    /**
     * Total items count.
     * @example 1000
     */
    public totalItems: number;

    /**
     * Total pages count.
     * @example 100
     */
    public totalPages: number;

    /**
     * Page items array.
     */
    @ApiProperty({ type: [ResourceClass] })
    public items: (T extends ClassType ? InstanceType<T> : T)[];
  }

  return PaginatedClass;
}

export type PaginationResult<T extends Record<string, any>> = InstanceType<
  ReturnType<typeof PaginatedDto<T>>
>;
