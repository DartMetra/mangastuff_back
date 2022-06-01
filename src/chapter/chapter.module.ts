import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { ChapterService } from './chapter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapter, ChapterSchema } from 'src/schema';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [AggregationModule, MongooseModule.forFeature([{ name: Chapter.name, schema: ChapterSchema }])],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
