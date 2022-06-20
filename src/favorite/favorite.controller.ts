import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { pagination } from 'src/types/pagination';
import { AuthGuard } from 'src/utils/auth.guard';
import { Pagination } from 'src/utils/pagination.decorator';
import { ParseObjectIdPipe } from 'src/utils/parseObjectId.pipe';
import { User } from 'src/utils/user.decorator';
import { FavoriteDto } from './dto/favorite.dto';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async getFavoriteList(@User('uid') user: string) {
    return await this.favoriteService.findFavorite(user);
  }

  @Patch('/')
  @UseGuards(AuthGuard)
  async updateFavorite(
    @User('uid') user: string,
    @Body('manga', ParseObjectIdPipe) manga: Types.ObjectId,
    @Body('to') to: string
  ) {
    return await this.favoriteService.addToFavorite(user, manga, to);
  }

  @Delete('/')
  @UseGuards(AuthGuard)
  async deleteFromFavorite(@User('uid') user: string, @Body('manga', ParseObjectIdPipe) manga: Types.ObjectId) {
    return await this.favoriteService.deleteFromFavorite(user, manga);
  }
}
