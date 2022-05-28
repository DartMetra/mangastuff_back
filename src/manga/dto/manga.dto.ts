import { Types } from 'mongoose';

export class MangaDto {
  contributors: Types.ObjectId[];

  description: string;

  title: string;

  originalTitle: string;

  year: string;

  author: string[];

  artist: string[];

  preview: string;

  banner: string;

  genres: Types.ObjectId[];
}
