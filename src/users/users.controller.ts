
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './users.model';
import { ValidationPipe } from '../validation.pipe';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() user: User): Promise<any> {
    try {
      const createdUser = await this.userService.create(user);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: createdUser,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get()
  async findAll(
    @Query('sort') sort: string,
    @Query('order') order: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<any> {
    try {
      const users = await this.userService.findAll(sort, order, page, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve users',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.userService.findOne(id);
      if (user) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User retrieved successfully',
          data: user,
        };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUser: Partial<User>): Promise<any> {
    try {
      const updatedUser = await this.userService.update(id, updateUser);
      if (updatedUser) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User updated successfully',
          data: updatedUser,
        };
      } else {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  @Post('change-password')
  async changePassword(
    @Body('userId') userId: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await this.userService.verifyPassword(user, currentPassword);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid current password');
      }

      await this.userService.changePassword(userId, newPassword);

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('An error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
