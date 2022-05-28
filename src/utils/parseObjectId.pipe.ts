import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    try {
      return new Types.ObjectId(value);
    } catch (e) {
      throw new BadRequestException('Invalid ObjectId');
    }
  }
}
