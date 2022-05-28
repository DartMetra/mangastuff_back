import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { User, UserSchema } from 'src/schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AggregationModule } from '../aggregation/aggregation.module';

@Module({
  imports: [FirebaseModule, AggregationModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
