import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Pagination } from 'src/utils/pagination.decorator';
import { ParseObjectIdPipe } from '../utils/parseObjectId.pipe';
import { GenreDto } from './dto/genre.dto';
import { GenreService } from './genre.service';
import { pagination } from '../types/pagination';

@Controller('/genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('/')
  async getGenreList(@Pagination() pag: pagination) {
    const { docs, totalCount } = await this.genreService.findGenres(pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/:id')
  async getGenreManga(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
    return await this.genreService.findById(_id);
  }

  @Post('/')
  async createGenre(@Body() genreDto: GenreDto) {
    return await this.genreService.create(genreDto);
  }

  @Patch('/:id')
  async updateGenre(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Body() genreDto: Partial<GenreDto>) {
    return await this.genreService.update(_id, genreDto);
  }
}
