import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { pagination } from 'src/types/pagination';
import { AuthGuard } from 'src/utils/auth.guard';
import { Pagination } from 'src/utils/pagination.decorator';
import { User } from 'src/utils/user.decorator';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/me')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/user');
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
    })
  )
  @UseGuards(AuthGuard)
  async createMe(@Body() user: UserDto, @User() tokenUser: any, @UploadedFile() photo?: Express.Multer.File) {
    if (photo) {
      user.photo = photo.filename;
    }
    return await this.userService.updateByToken(tokenUser, user);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getMe(@User('uid') uid: string) {
    const user = await this.userService.findById(uid);
    return user;
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUser(@Param() _id: string) {
    const user = await this.userService.findById(_id);
    return user;
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getUsersList(@Pagination() pag: pagination) {
    const { docs, totalCount } = await this.userService.findUsers(pag);
    return {
      docs,
      totalCount: totalCount ? (totalCount[0] ? totalCount[0].count : 0) : 0,
    };
  }

  @Delete('/me')
  @UseGuards(AuthGuard)
  async deleteMe(@User('uid') uid: string) {
    return await this.userService.delete(uid);
  }
}
