import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Types } from 'mongoose';
import { Pagination } from 'src/utils/pagination.decorator';
import { ParseObjectIdPipe } from '../utils/parseObjectId.pipe';
import { ChapterDto } from './dto/chapter.dto';
import { ChapterService } from './chapter.service';
import { pagination } from '../types/pagination';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get('/:id/byManga/:c')
  async getChapterByManga(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Param('c', ParseIntPipe) chapter: number) {
    const doc = await this.chapterService.findByMangaChapter(_id, chapter);
    return doc;
  }

  @Get('/:id/byManga')
  async getChaptersByManga(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Pagination() pag: pagination) {
    const { docs, totalCount } = await this.chapterService.findByManga(_id, pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/')
  async getChapterList(@Pagination() pag: pagination) {
    const { docs, totalCount } = await this.chapterService.findChapters(pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Get('/:id')
  async getMangaChapter(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
    return await this.chapterService.findById(_id);
  }

  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('pages[]', 80, {
      storage: diskStorage({
        destination: './public/page',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    })
  )
  async uploadChapterPhoto(@UploadedFiles() pages: Express.Multer.File[]) {
    return pages.map((page) => page.filename);
  }

  @Post('/')
  @UseInterceptors(
    FilesInterceptor('pages[]', 80, {
      storage: diskStorage({
        destination: './public/page',
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    })
  )
  async createChapter(@UploadedFiles() pages: Express.Multer.File[], @Body() chapterDto: ChapterDto) {
    if (chapterDto.manga) {
      chapterDto.manga = new Types.ObjectId(chapterDto.manga);
    }
    chapterDto.pages = pages.map((page) => page.filename);

    return await this.chapterService.create(chapterDto);
  }

  @Patch('/:id')
  async updateChapter(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Body() chapterDto: Partial<ChapterDto>) {
    if (chapterDto.manga) {
      chapterDto.manga = new Types.ObjectId(chapterDto.manga);
    }
    return await this.chapterService.update(_id, chapterDto);
  }
}
