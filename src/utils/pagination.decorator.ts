import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { pagination } from 'src/types/pagination';

export const Pagination = createParamDecorator((data: unknown, ctx: ExecutionContext): pagination => {
  const query = ctx.switchToHttp().getRequest().query;
  return {
    skip: query.skip ? +query.skip : 0,
    limit: query.limit ? +query.limit : 50,
    order: query.order ? query.order : -1,
    sortBy: query.sortBy ? query.sortBy : '_id',
  };
});
