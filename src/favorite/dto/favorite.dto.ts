import { Types } from 'mongoose';

export class FavoriteDto {
  user: string;

  favorite: Types.ObjectId[];

  reading: Types.ObjectId[];

  planed: Types.ObjectId[];

  read: Types.ObjectId[];

  abandoned: Types.ObjectId[];
}
