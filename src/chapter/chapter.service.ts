import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AggregationService } from 'src/aggregation/aggregation.service';
import { Chapter } from 'src/schema';
import { pagination } from 'src/types/pagination';
import { ChapterDto } from './dto/chapter.dto';

@Injectable()
export class ChapterService {
  constructor(private readonly aggregationService: AggregationService, @InjectModel(Chapter.name) private readonly Chapter: Model<Chapter>) {}

  async create(chapterDto: ChapterDto) {
    return await this.Chapter.create(chapterDto);
  }

  async update(_id: Types.ObjectId, chapterDto: Partial<ChapterDto>) {
    return await this.Chapter.updateOne({ _id }, chapterDto);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Chapter.findById(_id);
  }
  async findChapters(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (await this.Chapter.aggregate([this.aggregationService.facetTotalCount(pag)]))[0];
  }
}
