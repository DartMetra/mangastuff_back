import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { Favorite, FavoriteSchema } from 'src/schema';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [FirebaseModule, AggregationModule, MongooseModule.forFeature([{ name: Favorite.name, schema: FavoriteSchema }])],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
