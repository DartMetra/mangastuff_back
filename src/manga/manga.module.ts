import { Module } from '@nestjs/common';
import { MangaController } from './manga.controller';
import { MangaService } from './manga.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Manga, MangaSchema } from 'src/schema';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [AggregationModule, MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }])],
  controllers: [MangaController],
  providers: [MangaService],
})
export class MangaModule {}
