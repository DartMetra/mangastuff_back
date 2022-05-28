import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Manga } from 'src/schema';
import { MangaDto } from './dto/manga.dto';
import { pagination } from '../types/pagination';
import { AggregationService } from '../aggregation/aggregation.service';

@Injectable()
export class MangaService {
  constructor(private readonly aggregationService: AggregationService, @InjectModel(Manga.name) private readonly Manga: Model<Manga>) {}

  async create(mangaDto: MangaDto) {
    return await this.Manga.create(mangaDto);
  }

  async update(_id: Types.ObjectId, mangaDto: Partial<MangaDto>) {
    return await this.Manga.updateOne({ _id }, mangaDto);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Manga.findById(_id);
  }

  async findMangas(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (await this.Manga.aggregate([this.aggregationService.facetTotalCount(pag)]))[0];
  }
}
