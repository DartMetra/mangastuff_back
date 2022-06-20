import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MangaDocument = Manga & Document;

@Schema({ collection: 'Manga', versionKey: false, timestamps: true })
export class Manga {
  @Prop({ ref: 'User' })
  contributors: string[];

  @Prop()
  description: string;

  @Prop()
  title: string;

  @Prop()
  originalTitle: string;

  @Prop()
  year: number;

  @Prop()
  author: string[];

  @Prop()
  artist: string[];

  @Prop()
  preview: string;

  @Prop()
  banner: string;

  @Prop({ ref: 'Genre' })
  genres: Types.ObjectId[];
}

export const MangaSchema = SchemaFactory.createForClass(Manga);
