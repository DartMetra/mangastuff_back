import { Module } from '@nestjs/common';
import { AggregationService } from './aggregation.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AggregationService],
  exports: [AggregationService],
})
export class AggregationModule {}
