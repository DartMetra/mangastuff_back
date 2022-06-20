import { Types } from 'mongoose';

export class ChapterDto {
  manga: Types.ObjectId;

  chapter: number;

  volume: number;

  pages: string[];
}
