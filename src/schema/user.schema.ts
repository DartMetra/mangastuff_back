import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'User', versionKey: false, timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  _id: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  photo: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
