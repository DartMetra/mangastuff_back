import { Body, Controller, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
  async createChapter(@Body() chapterDto: ChapterDto) {
    return await this.chapterService.create(chapterDto);
  }

  @Patch('/:id')
  async updateChapter(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId, @Body() chapterDto: Partial<ChapterDto>) {
    return await this.chapterService.update(_id, chapterDto);
  }
}
