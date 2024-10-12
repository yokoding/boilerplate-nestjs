import {
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { StandardPaginationResultType } from './types/standard-pagination-result.type';
import { standardPagination } from './standard-pagination';
import { Repository, FindOptionsWhere, ILike, ObjectLiteral } from 'typeorm';

export class BaseController<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items per page',
  })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    type: String,
    description: 'Sorting data ASC / DESC',
  })
  @ApiQuery({
    name: 'order_by',
    required: false,
    type: String,
    description: 'Ordering data by selected field',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({
    name: 'relations',
    required: false,
    type: [String],
    isArray: true,
    description: 'Get relations data',
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort_by') sort_by: string = 'DESC',
    @Query('order_by') order_by: string = 'createdAt',
    @Query('q') q: string,
    @Query('relations') relations: string[] = [],
  ): Promise<StandardPaginationResultType<T>> {
    page = page ?? 1;
    limit = limit ?? 10;

    if (limit > 100) {
      limit = 100;
    }

    const w: FindOptionsWhere<T>[] = [];

    if (q) {
      w.push({ name: ILike(`%${q}%`) } as unknown as FindOptionsWhere<T>);
    }

    const o: any = {};
    if (order_by && sort_by) {
      o[order_by] = sort_by;
    }

    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: w,
      order: o,
      relations: Array.isArray(relations) ? relations : [relations],
    });

    return standardPagination(data, total, page, limit);
  }
}
