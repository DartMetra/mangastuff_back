import { Types } from 'mongoose';

export class ChapterDto {
  manga: Types.ObjectId;

  title: string;

  pages: string[];
}
