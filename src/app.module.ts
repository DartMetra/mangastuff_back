import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthorModule } from './author/author.module';
import { ChapterModule } from './chapter/chapter.module';
import { FavoriteModule } from './favorite/favorite.module';
import { GenreModule } from './genre/genre.module';
import { MangaModule } from './manga/manga.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    MangaModule,
    GenreModule,
    ChapterModule,
    AuthorModule,
    FavoriteModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.local.env', '.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
