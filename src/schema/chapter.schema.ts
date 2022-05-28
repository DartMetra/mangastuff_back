import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChapterDocument = Chapter & Document;

@Schema({ collection: 'Chapter', versionKey: false, timestamps: true })
export class Chapter {
  @Prop({ ref: 'Manga' })
  manga: Types.ObjectId;

  @Prop()
  pages: string[];
}

export const ChapterSchema = SchemaFactory.createForClass(Chapter);
