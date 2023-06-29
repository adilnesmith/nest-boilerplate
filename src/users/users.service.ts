import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async create(user: User): Promise<User> {
    const existingUser = await this.userModel.findOne({ uid: user.uid });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = new this.userModel({
      ...user,
      // password: hashedPassword,
    });
    return createdUser.save();
  }
  async update(userId: string, updates: Partial<User>): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // if (updates.password) {
    //   const hashedPassword = await bcrypt.hash(updates.password, 10);
    //   updates.password = hashedPassword;
    // } else {
    //   delete updates.password; // Remove the password property from the updates object
    // }

    Object.assign(user, updates);
    return user.save();
  }
  async findAll(sort?: string, order?: string, page?: number, limit?: number): Promise<any> {
    let query = this.userModel.find();

    // Apply sorting if sort and order parameters are provided
    if (sort && order) {
      const sortOptions: any = {};
      sortOptions[sort] = order === 'asc' ? 1 : -1;
      query = query.sort(sortOptions);
    }

    // Apply pagination if page and limit parameters are provided
    if (page && limit) {
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      query = query.skip(startIndex).limit(limit);

      // Get the total count of documents for pagination metadata
      const totalCount = await this.userModel.countDocuments().exec();

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);

      const items = await query.exec();

      return {
        items,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
        },
      };
    }

    const data = await query.exec();
    return {
      items: data,
    };
  }


  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
  // async verifyPassword(user: User, currentPassword: string): Promise<boolean> {
  //   const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  //   return isPasswordValid;
  // }
  // async changePassword(userId: string, newPassword: string): Promise<void> {
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
  // }
}
