import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AggregationService } from 'src/aggregation/aggregation.service';
import { User } from 'src/schema';
import { pagination } from 'src/types/pagination';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly aggregationService: AggregationService,
    @InjectModel(User.name) private readonly User: Model<User>
  ) {}

  async findUsers(pag: pagination = { limit: 20, skip: 0, order: 1, sortBy: '_id' }) {
    return (await this.User.aggregate([this.aggregationService.facetTotalCount(pag)]))[0];
  }

  async findById(_id: string) {
    return await this.User.findById(_id);
  }

  async updateByToken(
    payload: {
      name: string;
      picture: string;
      user_id: string;
      email: string;
      email_verified: boolean;
      firebase: any;
    },
    data: UserDto
  ) {
    const customer = await this.User.findById(payload.user_id);

    if (!customer) {
      return await this.User.create({
        _id: payload.user_id,
        name: payload.name,
        email: payload.email,
        photo: payload.picture,
      });
    }
    customer.name = data.name ? data.name : customer.name;
    customer.email = data.email ? data.email : customer.email;
    customer.photo = data.photo ? data.photo : customer.photo;
    await customer.save();

    return customer;
  }

  async delete(_id: string) {
    return await this.User.deleteMany({ _id });
  }
}
