import { Injectable } from '@nestjs/common';
import { pagination } from 'src/types/pagination';

@Injectable()
export class AggregationService {
  public facetTotalCount(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    const SORT = {
      $sort: {},
    };
    SORT['$sort'][pag.sortBy] = +pag.order;

    return {
      $facet: {
        documents: [SORT, { $skip: pag.skip }, { $limit: pag.limit }],
        totalCount: [
          {
            $count: 'count',
          },
        ],
      },
    };
  }
}
