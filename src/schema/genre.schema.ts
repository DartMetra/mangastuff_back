import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GenreDocument = Genre & Document;

@Schema({ collection: 'Genre', versionKey: false, timestamps: true })
export class Genre {
  @Prop({ required: true })
  title: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
