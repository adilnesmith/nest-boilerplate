
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './users.model';
import { ValidationPipe } from '../validation.pipe';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() user: User): Promise<User> {
    const createdUser = await this.userService.create(user);
    return createdUser;
  }

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findOne(id);
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: Partial<User>): Promise<User> {
    try {
      const updatedUser = await this.userService.update(id, updateUser);
      return updatedUser;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.delete(id);
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
