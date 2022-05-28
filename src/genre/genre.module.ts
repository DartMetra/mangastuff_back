import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from 'src/schema';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [AggregationModule, MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }])],
  controllers: [GenreController],
  providers: [GenreService],
})
export class GenreModule {}
