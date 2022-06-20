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
    return (
      await this.Manga.aggregate([
        {
          $match: {
            _id,
          },
        },
        {
          $lookup: {
            from: 'Author',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'contributor',
            foreignField: '_id',
            as: 'contributor',
          },
        },
        {
          $lookup: {
            from: 'Genre',
            localField: 'genres',
            foreignField: '_id',
            as: 'genres',
          },
        },
      ])
    )[0];
  }

  async findMangas(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (
      await this.Manga.aggregate([
        {
          $lookup: {
            from: 'Genre',
            localField: 'genres',
            foreignField: '_id',
            as: 'genres',
          },
        },
        this.aggregationService.facetTotalCount(pag),
      ])
    )[0];
  }

  async filterSearch(
    pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' },
    query?: { search: string; genres: Types.ObjectId[]; author: Types.ObjectId; year_start: number; year_end: number }
  ) {
    const PIPELINE: any[] = [];
    if (query) {
      if (query.search) {
        PIPELINE.push({
          $search: {
            'index': 'mangasearch',
            text: {
              query: query.search,
              path: {
                wildcard: '*',
              },
              fuzzy: {},
            },
          },
        });
      }

      if (query.genres && query.genres[0]) {
        PIPELINE.push({
          $match: {
            genres: { $all: query.genres },
          },
        });
      }

      if (query.author && query.author[0]) {
        PIPELINE.push({
          $match: {
            author: query.author,
          },
        });
      }

      if (query.year_start) {
        PIPELINE.push({
          $match: {
            year: { $gte: query.year_start },
          },
        });
      }

      if (query.year_end) {
        PIPELINE.push({
          $match: {
            year: { $lte: query.year_end },
          },
        });
      }
    }
    PIPELINE.push({
      $lookup: {
        from: 'Genre',
        localField: 'genres',
        foreignField: '_id',
        as: 'genres',
      },
    });
    PIPELINE.push({
      $lookup: {
        from: 'Author',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
      },
    });
    PIPELINE.push({
      $lookup: {
        from: 'User',
        localField: 'contributor',
        foreignField: '_id',
        as: 'contributor',
      },
    });
    PIPELINE.push(this.aggregationService.facetTotalCount(pag));

    return (await this.Manga.aggregate(PIPELINE))[0];
  }

  async findSimilarManga(_id: Types.ObjectId, pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    const { genres } = await this.Manga.findById(_id);
    return (
      await this.Manga.aggregate([
        {
          $match: {
            $or: genres.map((e) => {
              return { genres: e };
            }),
          },
        },
        {
          $lookup: {
            from: 'Author',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $lookup: {
            from: 'User',
            localField: 'contributor',
            foreignField: '_id',
            as: 'contributor',
          },
        },
        {
          $lookup: {
            from: 'Genre',
            localField: 'genres',
            foreignField: '_id',
            as: 'genres',
          },
        },
        this.aggregationService.facetTotalCount(pag),
      ])
    )[0];
  }
}
