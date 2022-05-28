import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AggregationService } from 'src/aggregation/aggregation.service';
import { Genre } from 'src/schema';
import { pagination } from 'src/types/pagination';
import { GenreDto } from './dto/genre.dto';

@Injectable()
export class GenreService {
  constructor(private readonly aggregationService: AggregationService, @InjectModel(Genre.name) private readonly Genre: Model<Genre>) {}
  async create(genreDto: GenreDto) {
    return await this.Genre.create(genreDto);
  }

  async update(_id: Types.ObjectId, genreDto: Partial<GenreDto>) {
    return await this.Genre.updateOne({ _id }, genreDto);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Genre.findById(_id);
  }
  async findGenres(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (await this.Genre.aggregate([this.aggregationService.facetTotalCount(pag)]))[0];
  }
}
