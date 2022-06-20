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
    return (
      await this.Chapter.aggregate([
        {
          $lookup: {
            from: 'Manga',
            localField: 'manga',
            foreignField: '_id',
            as: 'manga',
          },
        },
        {
          $unwind: {
            path: '$manga',
          },
        },
        this.aggregationService.facetTotalCount(pag),
      ])
    )[0];
  }

  async findByManga(_id: Types.ObjectId, pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (
      await this.Chapter.aggregate([
        { $match: { manga: _id } },
        {
          $lookup: {
            from: 'Manga',
            localField: 'manga',
            foreignField: '_id',
            as: 'manga',
          },
        },
        {
          $unwind: {
            path: '$manga',
          },
        },
        this.aggregationService.facetTotalCount(pag),
      ])
    )[0];
  }

  async findByMangaChapter(manga: Types.ObjectId, chapter: number) {
    return await this.Chapter.findOne({ manga, chapter });
  }
}
