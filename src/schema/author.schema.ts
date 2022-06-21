import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuthorDocument = Author & Document;

@Schema({ collection: 'Author', versionKey: false, timestamps: true })
export class Author {
  @Prop({ required: true })
  title: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
