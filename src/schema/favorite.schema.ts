import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ collection: 'Favorite', versionKey: false, timestamps: true })
export class Favorite {
  @Prop({ ref: 'User', unique: true, required: true })
  user: string;

  @Prop({ default: [], ref: 'Manga' })
  favorite: Types.ObjectId[];

  @Prop({ default: [], ref: 'Manga' })
  reading: Types.ObjectId[];

  @Prop({ default: [], ref: 'Manga' })
  planed: Types.ObjectId[];

  @Prop({ default: [], ref: 'Manga' })
  read: Types.ObjectId[];

  @Prop({ default: [], ref: 'Manga' })
  abandoned: Types.ObjectId[];
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
