import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { pagination } from 'src/types/pagination';
import { Pagination } from 'src/utils/pagination.decorator';
import { ParseObjectIdPipe } from '../utils/parseObjectId.pipe';
import { MangaDto } from './dto/manga.dto';
import { MangaService } from './manga.service';

@Controller('/manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Get('/:id/similar')
  async getSimilarMangaList(@Pagination() pag: pagination, @Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
    const { docs, totalCount } = await this.mangaService.findSimilarManga(_id, pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/')
  async getMangaList(@Pagination() pag: pagination, @Query() query) {
    if (query.genres && query.genres[0]) {
      query.genres = query.genres.map((e) => new Types.ObjectId(e));
    }
    if (query.author) {
      query.author = new Types.ObjectId(query.author);
    }
    if (query.year_start) {
      query.year_start = +query.year_start;
    }
    if (query.year_end) {
      query.year_end = +query.year_end;
    }
    if (query.author) {
      query.author = new Types.ObjectId(query.author);
    }
    const { docs, totalCount } = await this.mangaService.filterSearch(pag, query);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/:id')
  async getManga(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
    return await this.mangaService.findById(_id);
  }

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'preview', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, './public/manga/' + file.fieldname);
          },
          filename: (req, file, cb) => {
            cb(null, Date.now() + extname(file.originalname));
          },
        }),
      }
    )
  )
  async createManga(@UploadedFiles() files: { preview?: Express.Multer.File[]; banner?: Express.Multer.File[] }, @Body() mangaDto: MangaDto) {
    if (files.preview) {
      mangaDto.preview = files.preview[0].filename;
    }
    if (files.banner) {
      mangaDto.banner = files.banner[0].filename;
    }
    if (mangaDto.genres && mangaDto.genres[0]) {
      mangaDto.genres = mangaDto.genres.map((genre) => new Types.ObjectId(genre));
    }
    return await this.mangaService.create(mangaDto);
  }

  @Patch('/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'preview', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            cb(null, './public/manga/' + file.fieldname);
          },
          filename: (req, file, cb) => {
            cb(null, Date.now() + extname(file.originalname));
          },
        }),
      }
    )
  )
  async updateManga(
    @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
    @UploadedFiles() files: { preview?: Express.Multer.File[]; banner?: Express.Multer.File[] },
    @Body() mangaDto: Partial<MangaDto>
  ) {
    if (files.preview) {
      mangaDto.preview = files.preview[0].filename;
    }
    if (files.banner) {
      mangaDto.banner = files.banner[0].filename;
    }
    if (mangaDto.genres && mangaDto.genres[0]) {
      mangaDto.genres = mangaDto.genres.map((genre) => new Types.ObjectId(genre));
    }
    return await this.mangaService.update(_id, mangaDto);
  }
}
