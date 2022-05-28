import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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

  @Get('/')
  async getMangaList(@Pagination() pag: pagination) {
    const { docs, totalCount } = await this.mangaService.findMangas(pag);
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
    return await this.mangaService.update(_id, mangaDto);
  }
}
