import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AggregationService } from 'src/aggregation/aggregation.service';
import { Favorite } from 'src/schema';
import { pagination } from 'src/types/pagination';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly aggregationService: AggregationService,
    @InjectModel(Favorite.name) private readonly Favorite: Model<Favorite>
  ) {}

  async findFavorite(user: string) {
    return await this.Favorite.findOne({ user })
      .populate('favorite')
      .populate('reading')
      .populate('planed')
      .populate('read')
      .populate('abandoned');
  }

  async addToFavorite(user: string, manga: Types.ObjectId, to: string) {
    await this.Favorite.updateOne(
      { user },
      {
        $pull: { favorite: manga, abandoned: manga, read: manga, planed: manga, reading: manga },
      },
      {
        upsert: true,
      }
    );

    return await this.Favorite.updateOne({ user }, { $push: { [to]: manga } });
  }

  async deleteFromFavorite(user: string, manga: Types.ObjectId) {
    return await this.Favorite.updateOne(
      { user },
      {
        $pull: { favorite: manga, abandoned: manga, read: manga, planed: manga, reading: manga },
      },
      {
        upsert: true,
      }
    );
  }
}
