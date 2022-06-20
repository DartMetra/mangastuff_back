import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Types } from 'mongoose';
import { Pagination } from 'src/utils/pagination.decorator';
import { ParseObjectIdPipe } from '../utils/parseObjectId.pipe';
import { AuthorDto } from './dto/author.dto';
import { AuthorService } from './author.service';
import { pagination } from '../types/pagination';

@Controller('/author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get('/')
  async getAuthorList(@Pagination() pag: pagination) {
    const { docs, totalCount } = await this.authorService.findAuthors(pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/:id')
  async getAuthorManga(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
    return await this.authorService.findById(_id);
  }

  @Post('/')
  async createAuthor(@Body() authorDto: AuthorDto) {
    return await this.authorService.create(authorDto);
  }

  @Patch('/:id')
  async updateAuthor(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Body() authorDto: Partial<AuthorDto>) {
    return await this.authorService.update(_id, authorDto);
  }
}
