import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AggregationService } from 'src/aggregation/aggregation.service';
import { Author } from 'src/schema';
import { pagination } from 'src/types/pagination';
import { AuthorDto } from './dto/author.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly aggregationService: AggregationService, @InjectModel(Author.name) private readonly Author: Model<Author>) {}
  async create(authorDto: AuthorDto) {
    return await this.Author.create(authorDto);
  }

  async update(_id: Types.ObjectId, authorDto: Partial<AuthorDto>) {
    return await this.Author.updateOne({ _id }, authorDto);
  }

  async findById(_id: Types.ObjectId) {
    return await this.Author.findById(_id);
  }
  async findAuthors(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (await this.Author.aggregate([this.aggregationService.facetTotalCount(pag)]))[0];
  }
}
